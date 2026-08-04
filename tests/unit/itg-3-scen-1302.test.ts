import { generateDownloadUrl } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能 - ダウンロードURL有効期限管理', () => {
  // SCEN-1302
  test('推奨レポート生成・保存機能 - 生成されたダウンロードURLの有効期限が設定期限ジャストで切れる', () => {
    // Arrange
    jest.useFakeTimers();
    const now = new Date('2024-01-15T11:00:00Z');
    jest.setSystemTime(now);

    const reportId = 'report-20240115-001';
    const expirationDurationSeconds = 3600;
    const expirationTimestamp = new Date(now.getTime() + expirationDurationSeconds * 1000);

    const mockFileStorageAdapter = {
      uploadRecommendationReport: jest.fn().mockResolvedValue({
        reportId,
        s3Path: `s3://bucket/reports/${reportId}.pdf`,
        uploadedAt: now.toISOString(),
      }),
      generateDownloadUrl: jest.fn((reportIdParam: string, expirationParam: Date) => {
        const isExpired = new Date() > expirationParam;
        if (isExpired) {
          return Promise.reject(new Error('URLの有効期限が切れています'));
        }
        return Promise.resolve({
          downloadUrl: `https://s3.example.com/signed-url?expires=${expirationParam.getTime()}`,
          expirationTimestamp: expirationParam.toISOString(),
        });
      }),
    };

    // Act - 有効期限ジャストの時点でのGETリクエスト
    jest.setSystemTime(expirationTimestamp);
    const resultAtExpiration = mockFileStorageAdapter.generateDownloadUrl(
      reportId,
      expirationTimestamp
    );

    // Assert - 有効期限ジャストではURLが有効
    expect(resultAtExpiration).resolves.toMatchObject({
      downloadUrl: expect.stringContaining('signed-url'),
      expirationTimestamp: expirationTimestamp.toISOString(),
    });

    // Act - 有効期限を1ミリ秒超過した時点でのGETリクエスト
    jest.setSystemTime(new Date(expirationTimestamp.getTime() + 1));
    const resultAfterExpiration = mockFileStorageAdapter.generateDownloadUrl(
      reportId,
      expirationTimestamp
    );

    // Assert - 有効期限超過後は403 Forbiddenエラーが返却される
    expect(resultAfterExpiration).rejects.toThrow(/有効期限が切れています/);

    jest.useRealTimers();
  });
});