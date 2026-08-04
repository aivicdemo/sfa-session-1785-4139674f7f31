import { generateRecommendationReportWithRetry } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-2645
  test('FileStorageAdapterへの2回の再試行すべてが失敗したとき、エラーが発生する', async () => {
    const recommendationReportId = 'report-12345';
    const reportContent = {
      recommendationId: 'rec-001',
      customerName: 'テスト顧客',
      proposalApproach: 'テスト提案アプローチ',
      rationale: ['過去の類似案件での成功事例', '顧客のニーズマッチング度90%'],
      confidenceScore: 85,
      timestamp: '2024-01-15T11:00:00Z',
    };

    const mockFileStorageAdapter = {
      uploadRecommendationReport: jest.fn()
        .mockRejectedValueOnce(new Error('503 Service Unavailable'))
        .mockRejectedValueOnce(new Error('503 Service Unavailable'))
        .mockRejectedValueOnce(new Error('503 Service Unavailable')),
      generateDownloadUrl: jest.fn(),
      deleteExpiredReports: jest.fn(),
    };

    await expect(
      generateRecommendationReportWithRetry(
        recommendationReportId,
        reportContent,
        mockFileStorageAdapter
      )
    ).rejects.toThrow(/FILE_UPLOAD_FAILED_AFTER_RETRIES/);

    expect(mockFileStorageAdapter.uploadRecommendationReport).toHaveBeenCalledTimes(3);
  });
});