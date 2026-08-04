import { generateDownloadUrl } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェント推奨根拠の可視化機能 - レポートダウンロードURL生成', () => {
  test('SCEN-309: FileStorageAdapter.generateDownloadUrlが正常応答したとき、有効期限付きの一時URLが返却される', async () => {
    // Arrange
    const bucketName = 'sales-reports-bucket';
    const objectKey = 'recommendations/report-2024-01-15-001.pdf';
    const expirationSeconds = 3600;
    
    // Amazon S3の正常応答をシミュレート
    const expectedSignedUrl = 'https://sales-reports-bucket.s3.amazonaws.com/recommendations/report-2024-01-15-001.pdf?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAIOSFODNN7EXAMPLE%2F20240115%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20240115T110000Z&X-Amz-Expires=3600&X-Amz-SignedHeaders=host&X-Amz-Signature=abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890';
    
    const fileStorageAdapterStub = {
      generateDownloadUrl: jest.fn().mockResolvedValue(expectedSignedUrl),
    };

    // Act
    const result = await generateDownloadUrl(
      bucketName,
      objectKey,
      expirationSeconds,
      fileStorageAdapterStub
    );

    // Assert
    // URLが返却されていることを確認
    expect(result).toBe(expectedSignedUrl);
    
    // URLスキームがhttpsであることを確認
    expect(result).toMatch(/^https:\/\//);
    
    // URLの長さが100文字以上であることを確認
    expect(result.length).toBeGreaterThanOrEqual(100);
    
    // URLにオブジェクトキーが含まれていることを確認
    expect(result).toContain('report-2024-01-15-001.pdf');
    
    // URLに有効期限パラメータ（X-Amz-Expires）が含まれていることを確認
    expect(result).toMatch(/X-Amz-Expires=3600/);
    
    // URLにシグネチャパラメータ（X-Amz-Signature）が含まれていることを確認
    expect(result).toMatch(/X-Amz-Signature=/);
    
    // URLにIAM認証用のクレデンシャルパラメータが含まれていることを確認
    expect(result).toMatch(/X-Amz-Credential=/);
    
    // ファイルストレージアダプタが正しいパラメータで呼ばれたことを確認
    expect(fileStorageAdapterStub.generateDownloadUrl).toHaveBeenCalledWith(
      bucketName,
      objectKey,
      expirationSeconds
    );
  });
});