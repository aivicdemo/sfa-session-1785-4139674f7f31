import { calculateRecommendationTrustScore } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-859
  test('推奨根拠データが1件のとき信頼度スコアが正しく算出される', () => {
    const mockAIRecommendationEngine = {
      findSimilarPatterns: jest.fn().mockResolvedValue([
        {
          relevanceScore: 0.85,
          patternId: 'PATTERN-001',
          category: '大型案件向け提案',
        },
      ]),
      evaluatePatternRelevance: jest.fn().mockResolvedValue(0.85),
      generateRecommendation: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
    };

    const mockFileStorageAdapter = {
      uploadRecommendationReport: jest.fn(),
      generateDownloadUrl: jest.fn(),
      deleteExpiredReports: jest.fn(),
    };

    const dealConditions = {
      customerIndustry: 'manufacturing',
      dealSize: 'large',
      productCategory: 'enterprise_solution',
      timeline: '2024-Q2',
    };

    const result = calculateRecommendationTrustScore(
      dealConditions,
      mockAIRecommendationEngine,
      mockFileStorageAdapter,
    );

    expect(result).toBe(0.85);
  });
});