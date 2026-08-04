import { evaluatePatternRelevance } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン抽出と新規案件への推奨機能', () => {
  // SCEN-1343
  test('パターン適用可能スコアが閾値より1単位高いとき、推奨対象と判定される', async () => {
    const mockAIEngine = {
      evaluatePatternRelevance: jest.fn().mockResolvedValue({
        score: 0.71,
        isEligible: true,
      }),
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
    };

    const newDealInput = {
      customerIndustry: '製造業',
      dealAmount: 50000000,
      decisionMakers: 3,
    };

    const relevanceThreshold = 0.70;

    const result = await evaluatePatternRelevance(
      newDealInput,
      relevanceThreshold,
      mockAIEngine
    );

    expect(mockAIEngine.evaluatePatternRelevance).toHaveBeenCalledWith(
      newDealInput,
      relevanceThreshold
    );

    expect(result.score).toBe(0.71);
    expect(result.score).toBeGreaterThan(relevanceThreshold);
    expect(result.isRecommendationEligible).toBe(true);
  });
});