import { explainRecommendationReasoning } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-1681
  test('参照する成功パターンが存在しないとき、エラーが発生する', () => {
    const mockAIRecommendationEngine = {
      findSimilarPatterns: jest.fn().mockReturnValue([]),
      generateRecommendation: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const dealCondition = {
      customer_industry: '金融',
      deal_amount: 5000000,
      proposal_type: 'デジタル変革',
      customer_size: '大企業',
    };

    expect(() =>
      explainRecommendationReasoning(dealCondition, mockAIRecommendationEngine)
    ).toThrow(/PATTERN_NOT_FOUND|参照する成功パターン/);

    expect(mockAIRecommendationEngine.findSimilarPatterns).toHaveBeenCalledWith(
      expect.objectContaining({
        customer_industry: '金融',
        deal_amount: 5000000,
        proposal_type: 'デジタル変革',
        customer_size: '大企業',
      })
    );
  });
});