import { evaluateRecommendationWithPriorityValidation } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-2875
  test('改善指導の優先度が 10 を超えるとき、エラーを返す', () => {
    const improvementGuidance = {
      priority: 10.1,
      description: 'テスト用改善指導',
      recommendationType: 'proposal_approach',
      targetField: 'customer_segment',
    };

    const mockAIEngine = {
      evaluatePatternRelevance: jest.fn().mockReturnValue({
        priority: 10.1,
        relevanceScore: 85,
      }),
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
    };

    const result = evaluateRecommendationWithPriorityValidation(
      improvementGuidance,
      mockAIEngine,
    );

    expect(result).toEqual({
      success: false,
      errorCode: 'PRIORITY_EXCEEDED',
      errorMessage:
        '改善指導の優先度は 10 以下である必要があります。現在の優先度: 10.1',
      recommendation: null,
    });
  });
});