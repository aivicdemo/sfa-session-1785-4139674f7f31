import { calculateDuplicateDetectionRulePriority } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-476
  test('重複検知ルール実行優先度決定機能 - 重複検知ルールが複数件のときに全件の優先度スコアを算出する', () => {
    const rules = [
      {
        rule_id: 'rule_001',
        rule_name: 'exact_name_match',
        matching_condition: 'customer_name = customer_name AND customer_code = customer_code',
        data_quality_risk_degree: 8,
        detection_efficiency_score: 9,
        execution_count: 150,
        success_count: 142,
      },
      {
        rule_id: 'rule_002',
        rule_name: 'partial_name_phone_match',
        matching_condition: 'SUBSTRING(customer_name, 1, 5) = SUBSTRING(customer_name, 1, 5) AND phone = phone',
        data_quality_risk_degree: 6,
        detection_efficiency_score: 7,
        execution_count: 200,
        success_count: 156,
      },
      {
        rule_id: 'rule_003',
        rule_name: 'email_domain_match',
        matching_condition: 'SUBSTRING(email, POSITION("@" IN email)) = SUBSTRING(email, POSITION("@" IN email))',
        data_quality_risk_degree: 4,
        detection_efficiency_score: 5,
        execution_count: 180,
        success_count: 108,
      },
    ];

    const result = calculateDuplicateDetectionRulePriority(rules);

    expect(result).toHaveLength(3);
    expect(result[0]).toEqual({
      rule_id: 'rule_001',
      priority_score: 85,
    });
    expect(result[1]).toEqual({
      rule_id: 'rule_002',
      priority_score: 72,
    });
    expect(result[2]).toEqual({
      rule_id: 'rule_003',
      priority_score: 61,
    });
    expect(result.every((r) => typeof r.priority_score === 'number' && r.priority_score > 0)).toBe(true);
  });
});