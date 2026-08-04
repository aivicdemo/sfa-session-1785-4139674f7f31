import { generateRecommendationReportWithFallback } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-1116
  test('推奨レポート生成・保存機能 ( Amazon S3 連携 ) - 生成するPDFレポートの内容が空のとき、S3アップロード処理がエラーになる', async () => {
    const emptyRecommendationContent = {
      recommendationId: 'rec-001',
      approach: '',
      reasoning: '',
      successPatterns: [],
      riskFactors: [],
      confidenceScore: 0,
    };

    const mockAIEngine = {
      generateRecommendation: jest.fn().mockResolvedValue(emptyRecommendationContent),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    let uploadAttemptCount = 0;
    const mockFileStorage = {
      uploadRecommendationReport: jest.fn(async (reportContent: string) => {
        uploadAttemptCount++;
        if (!reportContent || reportContent.length === 0) {
          const error = new Error('ファイルコンテンツが空です');
          (error as any).name = 'ValidationError';
          throw error;
        }
        return { url: 'https://s3.example.com/report.pdf', expiresAt: new Date('2024-01-20T12:00:00Z') };
      }),
      generateDownloadUrl: jest.fn(),
      deleteExpiredReports: jest.fn(),
    };

    const customerData = {
      customerId: 'cust-001',
      industry: '製造業',
      scale: '大企業',
    };

    const dealData = {
      dealId: 'deal-001',
      stage: '提案段階',
      value: 5000000,
    };

    const result = await generateRecommendationReportWithFallback(
      customerData,
      dealData,
      mockAIEngine,
      mockFileStorage,
    );

    expect(uploadAttemptCount).toBe(3);
    expect(result.userMessage).toBe(
      'レポート生成に失敗しました。画面上で推奨内容を確認するか、後ほど再度お試しください',
    );
    expect(result.fallbackContent).toBeDefined();
    expect(result.fallbackFormat).toBe('html');
    expect(result.fallbackContent).toContain(emptyRecommendationContent.recommendationId);
  });
});