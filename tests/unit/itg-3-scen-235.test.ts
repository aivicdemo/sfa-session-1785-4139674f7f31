import { visualizeRecommendationReasoning } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェント推奨根拠の可視化機能', () => {
  // SCEN-235
  test('推奨根拠の類似度スコアが0未満のとき、可視化処理がバリデーションエラーをスロー', () => {
    const mockAIEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn().mockReturnValue(-0.5),
    };

    const invalidRecommendationData = {
      recommendationId: 'rec_001',
      customerId: 'cust_001',
      dealId: 'deal_001',
      proposedApproach: 'アップセル提案',
      confidenceScore: 85,
      patternRelevanceScore: -0.5,
      similarPatterns: [
        {
          patternId: 'pattern_001',
          relevanceScore: -0.5,
          successRate: 0.78,
          customerSegment: 'enterprise',
        },
      ],
      rootCauseFactors: ['購買履歴の類似性', '業種の一致'],
      generatedAt: new Date('2024-01-15T10:00:00Z'),
    };

    expect(() =>
      visualizeRecommendationReasoning(
        invalidRecommendationData,
        mockAIEngine
      )
    ).toThrow(/類似度スコア/);
  });
});