import { evaluatePatternRelevance } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン適用推奨機能', () => {
  test('SCEN-1587: 適用可能性スコアが100を超える値のとき、エラーが発生する', () => {
    const stub_AIRecommendationEngine = {
      evaluatePatternRelevance: jest.fn().mockResolvedValue({
        applicabilityScore: 101,
        isApplicable: true,
        reasoning: 'Test pattern match'
      })
    };

    const customer_info = {
      industry: 'IT',
      company_size: 'large',
      revenue: 10000000,
      customer_id: 'CUST-001'
    };

    const deal_conditions = {
      product_category: 'cloud_solution',
      deal_value: 500000,
      deal_stage: 'negotiation',
      deal_id: 'DEAL-001'
    };

    const success_pattern = {
      pattern_id: 'PAT-001',
      description: 'Enterprise cloud migration',
      target_industry: 'IT',
      target_size: 'large',
      success_rate: 0.85
    };

    expect(() =>
      evaluatePatternRelevance(
        customer_info,
        deal_conditions,
        success_pattern,
        stub_AIRecommendationEngine
      )
    ).toThrow(/適用可能性スコア/);

    try {
      evaluatePatternRelevance(
        customer_info,
        deal_conditions,
        success_pattern,
        stub_AIRecommendationEngine
      );
    } catch (error: any) {
      expect(error.name).toBe('ValidationError');
      expect(error.code).toBe('INVALID_APPLICABILITY_SCORE');
    }
  });
});