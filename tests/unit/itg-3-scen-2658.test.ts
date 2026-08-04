import { evaluatePatternRelevance } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン自動判定機能 - 顧客属性マッチスコア閾値判定', () => {
  // SCEN-2658
  test('顧客属性マッチスコアが閾値ちょうど（100%）のとき、適用対象として判定される', () => {
    const customer_attribute = {
      industry: 'manufacturing',
      company_size: 'large',
      annual_revenue: 50000000,
      employee_count: 500,
      business_model: 'B2B',
    };

    const success_pattern = {
      pattern_id: 'sp_001',
      target_industry: 'manufacturing',
      target_company_size: 'large',
      target_revenue_range_min: 40000000,
      target_revenue_range_max: 60000000,
      target_employee_range_min: 400,
      target_employee_range_max: 600,
      business_model_requirement: 'B2B',
    };

    const result = evaluatePatternRelevance(customer_attribute, success_pattern);

    expect(result.is_applicable).toBe(true);
    expect(result.match_score).toBe(100.0);
    expect(result.judgment_reason).toMatch(/マッチスコアが閾値.*到達.*適用対象/);
  });
});