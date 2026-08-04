import { generateDownloadUrl } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-816
  test('[normal] ファイルストレージ連携（正常系） - アップロードされたレポートの有効期限付きダウンロードURLが正常に生成される', () => {
    // テスト用レポートファイルのメタデータを定義
    const reportFileId = 'report-001';
    const s3Bucket = 'sales-ai-reports';
    const s3Region = 'ap-northeast-1';
    const s3Key = 'recommendations/2024-01-15/report-001.pdf';
    const uploadedAt = new Date('2024-01-15T10:00:00Z');

    // Amazon S3署名付きURL形式の期待値を定義
    const defaultExpiresSeconds = 3600;
    const currentTime = new Date('2024-01-15T11:00:00Z');
    const expirationTime = new Date(currentTime.getTime() + defaultExpiresSeconds * 1000);

    // X-Amz-Dateパラメータの期待値（UTC形式: YYYYMMDDTHHMMSSZ）
    const expectedAmzDate = '20240115T110000Z';

    // Amazon S3署名付きURLの期待値（正規表現で検証）
    const expectedUrlPattern = new RegExp(
      `^https://${s3Bucket}\\.s3\\.${s3Region}\\.amazonaws\\.com/${s3Key}\\?` +
      `X-Amz-Algorithm=AWS4-HMAC-SHA256&` +
      `X-Amz-Credential=.+&` +
      `X-Amz-Date=${expectedAmzDate}&` +
      `X-Amz-Expires=${defaultExpiresSeconds}&` +
      `X-Amz-Signature=.+&` +
      `X-Amz-SignedHeaders=.+$`
    );

    // FileStorageAdapterのgeneratDownloadUrlメソッドをモック化
    const mockFileStorageAdapter = {
      generateDownloadUrl: jest.fn().mockReturnValue(
        `https://${s3Bucket}.s3.${s3Region}.amazonaws.com/${s3Key}?` +
        `X-Amz-Algorithm=AWS4-HMAC-SHA256&` +
        `X-Amz-Credential=AKIAIOSFODNN7EXAMPLE/20240115/ap-northeast-1/s3/aws4_request&` +
        `X-Amz-Date=${expectedAmzDate}&` +
        `X-Amz-Expires=${defaultExpiresSeconds}&` +
        `X-Amz-Signature=abcdef1234567890&` +
        `X-Amz-SignedHeaders=host`
      ),
    };

    // テスト対象の関数を呼び出し
    const downloadUrl = generateDownloadUrl(reportFileId, mockFileStorageAdapter);

    // 検証1: メソッドが正しい引数で呼び出されたことを確認
    expect(mockFileStorageAdapter.generateDownloadUrl).toHaveBeenCalledWith(reportFileId);

    // 検証2: ダウンロードURLの形式がAmazon S3の署名付きURL形式であることを確認
    expect(downloadUrl).toMatch(expectedUrlPattern);

    // 検証3: URLに含まれるX-Amz-Expiresパラメータの値がデフォルト有効期限（3600秒）であることを確認
    const expiresMatch = downloadUrl.match(/X-Amz-Expires=(\d+)/);
    expect(expiresMatch).not.toBeNull();
    expect(expiresMatch?.[1]).toBe('3600');

    // 検証4: URLに含まれるX-Amz-DateパラメータがUTC形式の現在時刻に近い値であることを確認
    const amzDateMatch = downloadUrl.match(/X-Amz-Date=(\d{8}T\d{6}Z)/);
    expect(amzDateMatch).not.toBeNull();
    expect(amzDateMatch?.[1]).toBe(expectedAmzDate);

    // 検証5: X-Amz-Signatureパラメータが含まれていることを確認
    expect(downloadUrl).toContain('X-Amz-Signature=');

    // 検証6: 生成されたURLが有効期限内であることを確認
    // X-Amz-Date + X-Amz-Expires > 現在時刻
    const amzDateTimestamp = new Date(`${amzDateMatch?.[1].slice(0, 4)}-${amzDateMatch?.[1].slice(4, 6)}-${amzDateMatch?.[1].slice(6, 8)}T${amzDateMatch?.[1].slice(9, 11)}:${amzDateMatch?.[1].slice(11, 13)}:${amzDateMatch?.[1].slice(13, 15)}Z`).getTime();
    const expiresTimestamp = amzDateTimestamp + (parseInt(expiresMatch?.[1] || '0', 10) * 1000);
    const currentTimestamp = currentTime.getTime();

    expect(expiresTimestamp).toBeGreaterThan(currentTimestamp);
  });
});