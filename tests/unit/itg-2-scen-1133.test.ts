import { detectDuplicateCustomers } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-1133
  test('正規化後の顧客メールアドレスが一致する場合、重複候補として判定される', () => {
    const customer_a = {
      customer_id: 'CUST-001',
      email: '  User@Example.COM  ',
      name: 'Customer A',
      phone: '090-1234-5678',
    };

    const customer_b = {
      customer_id: 'CUST-002',
      email: 'user@example.com',
      name: 'Customer B',
      phone: '090-9876-5432',
    };

    const normalization_rules = [
      {
        rule_id: 'NORM-001',
        field_name: 'email',
        rule_type: 'trim',
        pattern: null,
        replacement: null,
        priority: 1,
      },
      {
        rule_id: 'NORM-002',
        field_name: 'email',
        rule_type: 'lowercase',
        pattern: null,
        replacement: null,
        priority: 2,
      },
    ];

    const duplicate_detection_rules = [
      {
        rule_id: 'DUP-001',
        rule_name: 'Email Match',
        match_field: 'email',
        match_type: 'exact',
        priority: 1,
        confidence_threshold: 0.95,
      },
    ];

    const result = detectDuplicateCustomers(
      [customer_a, customer_b],
      normalization_rules,
      duplicate_detection_rules
    );

    expect(result.is_duplicate).toBe(true);
    expect(result.duplicate_candidates).toHaveLength(1);
    expect(result.duplicate_candidates[0]).toEqual({
      customer_id_1: 'CUST-001',
      customer_id_2: 'CUST-002',
      match_field: 'email',
      normalized_value_1: 'user@example.com',
      normalized_value_2: 'user@example.com',
      confidence_score: 1.0,
      is_merge_candidate: true,
    });
    expect(result.normalization_results).toHaveLength(2);
    expect(result.normalization_results[0].email).toBe('user@example.com');
    expect(result.normalization_results[1].email).toBe('user@example.com');
  });
});