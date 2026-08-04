import { evaluateRecommendationScore } from '../../src/logic/it-1-br-3-3-2-1';

describe('推奨精度スコア算出機能', () => {
  // SCEN-2425
  test('顧客条件が完全一致した成功パターンの重み付けが最大値となる', () => {
    const mockAIRecommendationEngine = {
      evaluatePatternRelevance: jest.fn().mockReturnValue(1.0),
    };

    const customerCondition = {
      industry: 'IT',
      companyScale: '中堅',
      budget: '1000万円以上',
      implementationTimeline: '3ヶ月以内',
    };

    const successPattern = {
      industry: 'IT',
      companyScale: '中堅',
      budget: '1000万円以上',
      implementationTimeline: '3ヶ月以内',
    };

    const result = evaluateRecommendationScore(
      customerCondition,
      successPattern,
      mockAIRecommendationEngine
    );

    expect(result).toBe(1.0);
    expect(mockAIRecommendationEngine.evaluatePatternRelevance).toHaveBeenCalledTimes(1);
    expect(mockAIRecommendationEngine.evaluatePatternRelevance).toHaveBeenCalledWith(
      customerCondition,
      successPattern
    );
  });
});