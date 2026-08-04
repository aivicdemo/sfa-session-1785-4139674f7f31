import { generateRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン抽出と提案アプローチ自動推奨', () => {
  // SCEN-1547
  test('適合性スコアが推奨判定閾値より直下の場合、提案アプローチは推奨されない', () => {
    const relevanceScore = 0.74;
    const recommendationThreshold = 0.75;

    const mockAIEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn().mockReturnValue(relevanceScore),
    };

    const customerConditions = {
      scale: '中堅企業',
      industry: '製造業',
      budget: '500万円～1000万円',
      implementationPeriod: '3ヶ月以内',
    };

    const result = generateRecommendation(customerConditions, mockAIEngine, recommendationThreshold);

    expect(result.isRecommended).toBe(false);
    expect(result.recommendedApproaches).toEqual([]);
    expect(result.metadata.relevanceScore).toBe(0.74);
  });
});