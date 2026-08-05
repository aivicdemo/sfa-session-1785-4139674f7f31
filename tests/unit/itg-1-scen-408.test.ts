import { calculatePatternApplicability } from '../../src/logic/it-1-br-2-1-1';

describe('営業担当者の行動パターンと成約実績の自動分析・レポート機能', () => {
  // SCEN-408
  test('成功パターン適用判定機能 - 顧客属性の一致度がちょうど許容範囲の上限と等しい場合、パターン適用の根拠として採用される', () => {
    const tolerance_upper_limit_percent = 85;
    const customer_attribute_match_percent = 85;
    const success_pattern_id = 'pattern_001';
    const customer_id = 'cust_542';
    const customer_industry = 'manufacturing';
    const customer_revenue_range = '100M-500M';
    const pattern_industry = 'manufacturing';
    const pattern_revenue_range = '100M-500M';

    const result = calculatePatternApplicability({
      success_pattern_id,
      customer_id,
      customer_industry,
      customer_revenue_range,
      pattern_industry,
      pattern_revenue_range,
      tolerance_upper_limit_percent,
      customer_attribute_match_percent,
    });

    expect(result.is_adopted).toBe(true);
    expect(result.adoption_basis).toBe('顧客属性一致度：許容範囲上限値');
    expect(result.match_confidence_percent).toBe(85);
  });
});