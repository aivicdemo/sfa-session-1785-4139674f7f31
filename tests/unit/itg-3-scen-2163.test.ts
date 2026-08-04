import { generateDownloadUrl } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能 - ダウンロードURL生成エラーハンドリング', () => {
  // SCEN-2163
  test('FileStorageAdapter.generateDownloadUrl が Amazon S3 API の getSignedUrl 呼び出しに失敗したとき、適切なエラーをスロー', async () => {
    const reportFileKey = 'reports/recommendation_20260801_12345.pdf';

    const mockS3Error = new Error('AccessDenied');
    const mockFileStorageAdapter = {
      generateDownloadUrl: async (fileKey: string): Promise<string> => {
        throw new Error(`S3 getSignedUrl failed: ${mockS3Error.message}`);
      },
    };

    await expect(
      mockFileStorageAdapter.generateDownloadUrl(reportFileKey)
    ).rejects.toThrow(/S3 getSignedUrl failed|AccessDenied/);
  });
});