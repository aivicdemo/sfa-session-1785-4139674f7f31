import { calculatePatternApplicabilityWithThresholdExceeded } from '../../src/logic/it-1-br-2-1-1';

describe('成功パターン適用判定機能 - 顧客属性一致度が許容範囲上限を超過した場合', () => {
  // SCEN-409
  test('顧客属性一致度が許容範囲上限(80%)を超過(85%)した場合、パターン適用根拠として採用され、一致度スコアと理由コードが記録される', () => {
    const success_pattern_id = 'SP-2024-001';
    const customer_attribute_match_score = 85;
    const threshold_upper_limit = 80;
    const customer_id = 'CUST-12345';
    const industry_category = 'IT_SERVICE';
    const company_scale = 'LARGE';
    const purchase_history_months = 24;

    const applicability_result = calculatePatternApplicabilityWithThresholdExceeded({
      success_pattern_id,
      customer_attribute_match_score,
      threshold_upper_limit,
      customer_id,
      industry_category,
      company_scale,
      purchase_history_months,
    });

    expect(applicability_result.pattern_adopted).toBe(true);
    expect(applicability_result.match_score).toBe(85);
    expect(applicability_result.reason_codes).toContain('CUST_ATTR_THRESHOLD_EXCEEDED');
    expect(applicability_result.applicability_status).toBe('ADOPTED_WITH_THRESHOLD_EXCEEDED');
  });
});