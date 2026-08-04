import { evaluateRecommendationScore } from '../../src/logic/it-1-br-3-3-2-1';

describe('推奨妥当性スコア算出機能 - パターンマッチ度0%のエッジケース', () => {
  test('SCEN-1714: パターンマッチ度がちょうど0%のとき推奨スコアを0で計算し推奨内容を返却しない', () => {
    const mockAIEngine = {
      evaluatePatternRelevance: jest.fn().mockReturnValue(0.0),
    };

    const dealCondition = {
      customer_industry: 'manufacturing',
      customer_scale: 'large',
      product_category: 'cloud_infrastructure',
      contract_amount: 5000000,
      sales_stage: 'negotiation',
    };

    const result = evaluateRecommendationScore(dealCondition, mockAIEngine);

    expect(result.calculatedScore).toBe(0);
    expect(result.recommendation).toBeNull();
    expect(mockAIEngine.evaluatePatternRelevance).toHaveBeenCalledWith(dealCondition);
  });
});