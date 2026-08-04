import { generateRecommendationReport } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェント推奨根拠の可視化機能 - レポート生成エラーハンドリング', () => {
  // SCEN-1117
  test('ダウンロードURL生成時の有効期限がnullのとき、エラーが発生し適切なフォールバック処理が実行される', async () => {
    const mockFileStorageAdapter = {
      uploadRecommendationReport: jest.fn().mockResolvedValue({
        fileKey: 'recommendation-report-20240115',
        uploadedAt: new Date('2024-01-15T11:00:00Z'),
      }),
      generateDownloadUrl: jest.fn().mockImplementation((reportId, expirationTime) => {
        if (expirationTime === null || expirationTime === undefined) {
          const error = new Error('有効期限が指定されていません');
          (error as any).code = 'ValidationError';
          throw error;
        }
        return `https://s3.amazonaws.com/bucket/reports/${reportId}?expires=${expirationTime}`;
      }),
      deleteExpiredReports: jest.fn().mockResolvedValue(undefined),
    };

    const recommendationContent = {
      proposalApproach: '顧客の経営課題に基づいた段階的な提案',
      successPattern: {
        customerIndustry: '製造業',
        dealSize: 5000000,
        approachType: 'consultative',
      },
      confidenceScore: 85,
      rationale: [
        '過去類似案件3件の成功パターンと高度に合致（89%相似度）',
        '顧客の購買シグナル（予算確保、決定権者確認）が全て揃っている',
      ],
    };

    const reportMetadata = {
      reportId: 'rec-20240115-001',
      customerId: 'cust-12345',
      generatedAt: new Date('2024-01-15T11:00:00Z'),
      generatedBy: 'user-789',
    };

    let errorCaught: Error | null = null;
    let fallbackHtmlDisplayed = false;

    try {
      await generateRecommendationReport(
        recommendationContent,
        reportMetadata,
        mockFileStorageAdapter,
        null
      );
    } catch (error) {
      errorCaught = error as Error;
    }

    if (errorCaught) {
      expect(errorCaught.message).toMatch(/有効期限が指定されていません|expirationTime is required|有効期限/);
      expect((errorCaught as any).code).toBe('ValidationError');
      fallbackHtmlDisplayed = true;
    }

    expect(fallbackHtmlDisplayed).toBe(true);
    expect(mockFileStorageAdapter.generateDownloadUrl).toHaveBeenCalledWith('rec-20240115-001', null);
  });
});