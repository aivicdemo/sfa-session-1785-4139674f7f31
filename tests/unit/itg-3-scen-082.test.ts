import { generateDownloadUrl } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェント推奨根拠の可視化機能 - ダウンロードURL生成', () => {
  test('SCEN-082: [normal] ダウンロードURLが1件のレポートメタデータに対して正常に生成される', () => {
    // テスト用のレポートメタデータを生成
    const reportMetadata = {
      reportId: 'RPT-001',
      fileName: 'recommendation_report_20240115.pdf',
      s3Key: 'reports/2024/RPT-001.pdf',
      fileSize: 2048576,
      createdAt: '2024-01-15T10:30:00Z',
      expiresAt: '2024-01-22T10:30:00Z',
    };

    // Amazon S3 API呼び出しをスタブ化
    const stubFileStorageAdapter = {
      generateDownloadUrl: jest.fn().mockReturnValue(
        'https://bucket.s3.amazonaws.com/reports/2024/RPT-001.pdf?X-Amz-Signature=xxx&X-Amz-Expires=604800'
      ),
    };

    // FileStorageAdapterの generateDownloadUrl メソッドを呼び出し
    const result = generateDownloadUrl(reportMetadata, stubFileStorageAdapter);

    // 戻り値のURLが返却されることを確認
    expect(result).toBe(
      'https://bucket.s3.amazonaws.com/reports/2024/RPT-001.pdf?X-Amz-Signature=xxx&X-Amz-Expires=604800'
    );

    // 返却されたURLに以下の要素が含まれていることを検証
    expect(result).toMatch(/bucket\.s3\.amazonaws\.com/);
    expect(result).toMatch(/reports\/2024\/RPT-001\.pdf/);
    expect(result).toMatch(/X-Amz-Signature=xxx/);
    expect(result).toMatch(/X-Amz-Expires=604800/);

    // スタブの generateDownloadUrl が正確に1回だけ呼び出されたことをassertする
    expect(stubFileStorageAdapter.generateDownloadUrl).toHaveBeenCalledTimes(1);
    expect(stubFileStorageAdapter.generateDownloadUrl).toHaveBeenCalledWith(
      reportMetadata
    );
  });
});