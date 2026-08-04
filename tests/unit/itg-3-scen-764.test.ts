import { generateRecommendation } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-764
  test('複数の類似パターンが返されるとき、ランク上位の提案アプローチが返却される', () => {
    const mockSimilarPatterns = [
      {
        relevanceScore: 0.95,
        approachRank: 1,
        recommendedApproach: 'ローカル提案アプローチA',
      },
      {
        relevanceScore: 0.88,
        approachRank: 2,
        recommendedApproach: 'ローカル提案アプローチB',
      },
      {
        relevanceScore: 0.82,
        approachRank: 3,
        recommendedApproach: 'ローカル提案アプローチC',
      },
    ];

    const mockAIRecommendationEngine = {
      findSimilarPatterns: jest.fn().mockResolvedValue(mockSimilarPatterns),
      generateRecommendation: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const newDealCondition = {
      customerIndustry: 'IT',
      dealStage: 'proposal',
      budgetSize: 5000000,
    };

    const result = generateRecommendation(
      newDealCondition,
      mockAIRecommendationEngine
    );

    expect(mockAIRecommendationEngine.findSimilarPatterns).toHaveBeenCalled();
    expect(result.recommendedApproach).toBe('ローカル提案アプローチA');
    expect(result.approachRank).toBe(1);
  });
});