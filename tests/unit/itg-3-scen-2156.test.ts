import { generateRecommendationReport } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-2156
  test('推奨レポートのPDF/Excel生成 - 推奨内容が空文字列のとき、エラーが発生する', () => {
    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendationContent: '',
        recommendationId: 'rec-001',
        confidenceScore: 85,
      }),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const mockFileStorageAdapter = {
      uploadRecommendationReport: jest.fn(),
      generateDownloadUrl: jest.fn(),
      deleteExpiredReports: jest.fn(),
    };

    const input = {
      customerId: 'cust-001',
      dealId: 'deal-001',
      dealConditions: {
        industry: 'IT',
        companySize: 'large',
        budget: 5000000,
      },
    };

    expect(() =>
      generateRecommendationReport(
        input,
        mockAIRecommendationEngine,
        mockFileStorageAdapter
      )
    ).toThrow(/推奨内容が空です/);

    expect(mockFileStorageAdapter.uploadRecommendationReport).not.toHaveBeenCalled();
  });
});