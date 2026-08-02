import { detectDuplicateCustomers } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-464
  test('[normal] 顧客データ重複検出と統合判定 - 正規化ルールの適用順序が異なる場合でも、最終的な判定結果は同じである', () => {
    const testCustomers = [
      {
        customer_id: 'CUST001',
        customer_name: 'ABC  Company Inc.',
        customer_email: 'contact@ABC-COMPANY.com'
      },
      {
        customer_id: 'CUST002',
        customer_name: 'abc company inc',
        customer_email: 'contact@abccompany.com'
      },
      {
        customer_id: 'CUST003',
        customer_name: 'XYZ Corporation Ltd.',
        customer_email: 'info@xyz-corp.com'
      },
      {
        customer_id: 'CUST004',
        customer_name: 'xyz corporation ltd',
        customer_email: 'info@xyzcorp.com'
      }
    ];

    const normalizationRulesPatternA = [
      { rule_id: 'TRIM_SPACES', rule_type: 'trim_spaces', priority: 1 },
      { rule_id: 'NORMALIZE_CASE', rule_type: 'normalize_case', priority: 2 },
      { rule_id: 'REMOVE_SPECIAL_CHARS', rule_type: 'remove_special_chars', priority: 3 }
    ];

    const normalizationRulesPatternB = [
      { rule_id: 'REMOVE_SPECIAL_CHARS', rule_type: 'remove_special_chars', priority: 1 },
      { rule_id: 'TRIM_SPACES', rule_type: 'trim_spaces', priority: 2 },
      { rule_id: 'NORMALIZE_CASE', rule_type: 'normalize_case', priority: 3 }
    ];

    const normalizationRulesPatternC = [
      { rule_id: 'NORMALIZE_CASE', rule_type: 'normalize_case', priority: 1 },
      { rule_id: 'REMOVE_SPECIAL_CHARS', rule_type: 'remove_special_chars', priority: 2 },
      { rule_id: 'TRIM_SPACES', rule_type: 'trim_spaces', priority: 3 }
    ];

    const resultPatternA = detectDuplicateCustomers({
      customers: testCustomers,
      normalization_rules: normalizationRulesPatternA,
      similarity_threshold: 0.95,
      match_fields: ['customer_name', 'customer_email']
    });

    const resultPatternB = detectDuplicateCustomers({
      customers: testCustomers,
      normalization_rules: normalizationRulesPatternB,
      similarity_threshold: 0.95,
      match_fields: ['customer_name', 'customer_email']
    });

    const resultPatternC = detectDuplicateCustomers({
      customers: testCustomers,
      normalization_rules: normalizationRulesPatternC,
      similarity_threshold: 0.95,
      match_fields: ['customer_name', 'customer_email']
    });

    expect(resultPatternA.duplicate_detected).toBe(true);
    expect(resultPatternB.duplicate_detected).toBe(true);
    expect(resultPatternC.duplicate_detected).toBe(true);

    expect(resultPatternA.match_score).toBeCloseTo(resultPatternB.match_score, 5);
    expect(resultPatternB.match_score).toBeCloseTo(resultPatternC.match_score, 5);

    expect(resultPatternA.merge_target_customer_ids.length).toBe(resultPatternB.merge_target_customer_ids.length);
    expect(resultPatternB.merge_target_customer_ids.length).toBe(resultPatternC.merge_target_customer_ids.length);

    const sortedMergeTargetsA = resultPatternA.merge_target_customer_ids.sort();
    const sortedMergeTargetsB = resultPatternB.merge_target_customer_ids.sort();
    const sortedMergeTargetsC = resultPatternC.merge_target_customer_ids.sort();

    expect(sortedMergeTargetsA).toEqual(sortedMergeTargetsB);
    expect(sortedMergeTargetsB).toEqual(sortedMergeTargetsC);

    expect(resultPatternA.merge_target_customer_ids).toContain('CUST001');
    expect(resultPatternA.merge_target_customer_ids).toContain('CUST002');

    expect(resultPatternA.merge_target_customer_ids).toContain('CUST003');
    expect(resultPatternA.merge_target_customer_ids).toContain('CUST004');
  });
});