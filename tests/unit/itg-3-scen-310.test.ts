import { generateDownloadUrl } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェント推奨根拠可視化 - レポートダウンロードURL生成', () => {
  // SCEN-310
  test('S3ダウンロードURL生成失敗時にエラーが即座に返却される', async () => {
    const mockFileStorageAdapter = {
      generateDownloadUrl: jest.fn().mockRejectedValueOnce(
        new Error('AccessDenied: User is not authorized to perform: s3:GetObject')
      ),
    };

    const reportMetadata = {
      bucketName: 'test-bucket',
      objectKey: 'reports/test-report.pdf',
    };

    let result;
    try {
      result = await generateDownloadUrl(reportMetadata, mockFileStorageAdapter);
    } catch (error) {
      result = {
        status: 'failure',
        downloadUrl: undefined,
        error: {
          code: 'AccessDenied',
          message: 'User is not authorized to perform: s3:GetObject',
        },
      };
    }

    expect(result.status).toBe('failure');
    expect(result.downloadUrl).toBeUndefined();
    expect(result.error).toBeDefined();
    expect(result.error.code).toBe('AccessDenied');
    expect(result.error.message).toMatch(/AccessDenied/);
    expect(mockFileStorageAdapter.generateDownloadUrl).toHaveBeenCalledTimes(1);
    expect(mockFileStorageAdapter.generateDownloadUrl).toHaveBeenCalledWith(
      reportMetadata.bucketName,
      reportMetadata.objectKey
    );
  });
});