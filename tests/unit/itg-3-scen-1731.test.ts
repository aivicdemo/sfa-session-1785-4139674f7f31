import { calculateRecommendationScore } from '../../src/logic/it-1-br-3-3-2-1';

describe('推奨妥当性スコア算出機能', () => {
  // SCEN-1731
  test('信頼度スコアが0.01のとき推奨スコアを計算する', () => {
    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn().mockReturnValue(0.01),
    };

    const dealCondition = {
      customer_industry: 'IT',
      budget_scale: 500000,
      purchase_cycle_days: 90,
      customer_size: 'LARGE',
      deal_stage: 'NEGOTIATION',
    };

    const result = calculateRecommendationScore(
      dealCondition,
      mockAIRecommendationEngine
    );

    expect(result).toBeGreaterThanOrEqual(0.01);
    expect(result).toBeLessThanOrEqual(0.1);
    expect(typeof result).toBe('number');
    
    const decimalPlaces = result.toString().split('.')[1]?.length || 0;
    expect(decimalPlaces).toBeLessThanOrEqual(2);

    expect(mockAIRecommendationEngine.evaluatePatternRelevance).toHaveBeenCalled();
  });
});