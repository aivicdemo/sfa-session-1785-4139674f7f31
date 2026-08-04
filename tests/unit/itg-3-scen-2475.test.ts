import { generateRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('提案アプローチの自動推奨機能', () => {
  // SCEN-2475
  test('新規案件が成功パターンとマッチしないとき、推奨アプローチが0件となる', () => {
    const mockAIEngine = {
      findSimilarPatterns: jest.fn().mockResolvedValue([]),
      generateRecommendation: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const newDealData = {
      customerIndustry: 'IT企業',
      dealStage: '初期接触',
      budgetRange: '100万円以下',
      issue: 'システム保守',
    };

    return generateRecommendation(newDealData, mockAIEngine).then((result) => {
      expect(result.recommendedApproaches).toEqual([]);
      expect(result.recommendationCount).toBe(0);
      expect(result.message).toMatch(/マッチする成功パターンが見つかりませんでした/);
    });
  });
});