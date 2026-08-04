import { evaluatePatternRelevance } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェント推論精度スコア算出機能', () => {
  // SCEN-2382
  test('端数を含む精度スコアが標準的な四捨五入ルールで整数値に丸められる', () => {
    const mock_AIRecommendationEngine = {
      evaluatePatternRelevance: jest.fn()
    };

    const fractional_score_87_456 = 87.456;
    mock_AIRecommendationEngine.evaluatePatternRelevance.mockReturnValue({
      relevance_score: fractional_score_87_456
    });

    const pattern_data = {
      customer_industry: 'manufacturing',
      customer_scale: 'large',
      deal_stage: 'proposal'
    };

    const recommendation_data = {
      proposed_approach: 'consultative_selling',
      estimated_success_rate: 0.82
    };

    const result = evaluatePatternRelevance(
      pattern_data,
      recommendation_data,
      mock_AIRecommendationEngine
    );

    const expected_rounded_score = 87;
    expect(result.accuracy_score).toBe(expected_rounded_score);
  });
});