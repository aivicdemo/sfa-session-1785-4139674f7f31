import { applyQualityRulesForDuplicateDetection } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-263
  test('[normal] 顧客データ重複検出機能 - データ品質ルールが複数件のとき、全てのルールが品質検証に適用される', () => {
    const rule1 = {
      rule_id: 'RULE-001',
      rule_name: 'メールアドレス完全一致重複判定',
      rule_type: 'email_exact_match',
      comparison_field: 'email',
      comparison_method: 'exact_match',
      created_at: '2024-01-01T00:00:00Z',
    };

    const rule2 = {
      rule_id: 'RULE-002',
      rule_name: '電話番号完全一致重複判定',
      rule_type: 'phone_exact_match',
      comparison_field: 'phone_number',
      comparison_method: 'exact_match',
      created_at: '2024-01-01T00:00:00Z',
    };

    const rule3 = {
      rule_id: 'RULE-003',
      rule_name: '氏名読み仮名と住所完全一致重複判定',
      rule_type: 'name_address_match',
      comparison_field: 'name_kana,address',
      comparison_method: 'exact_match',
      created_at: '2024-01-01T00:00:00Z',
    };

    const qualityRules = [rule1, rule2, rule3];

    const customerDataSet = [
      {
        customer_id: 'CUST-001',
        name: 'customer_A_name',
        name_kana: 'customer_A_kana',
        email: 'customer_a@example.com',
        phone_number: '090-1111-1111',
        address: 'Tokyo-1',
        created_at: '2024-01-01T00:00:00Z',
      },
      {
        customer_id: 'CUST-002',
        name: 'customer_B_name',
        name_kana: 'customer_B_kana',
        email: 'customer_b@example.com',
        phone_number: '090-1111-1111',
        address: 'Tokyo-2',
        created_at: '2024-01-01T00:00:00Z',
      },
      {
        customer_id: 'CUST-003',
        name: 'customer_A_name',
        name_kana: 'customer_A_kana',
        email: 'customer_c@example.com',
        phone_number: '090-2222-2222',
        address: 'Tokyo-1',
        created_at: '2024-01-01T00:00:00Z',
      },
    ];

    const result = applyQualityRulesForDuplicateDetection(qualityRules, customerDataSet);

    expect(result.total_rules_applied).toBe(3);
    expect(result.rules_executed).toHaveLength(3);

    const rule1_result = result.rules_executed.find(
      (r) => r.rule_id === 'RULE-001'
    );
    expect(rule1_result).toBeDefined();
    expect(rule1_result?.duplicate_count).toBe(0);
    expect(rule1_result?.rule_id).toBe('RULE-001');
    expect(rule1_result?.rule_name).toBe('メールアドレス完全一致重複判定');

    const rule2_result = result.rules_executed.find(
      (r) => r.rule_id === 'RULE-002'
    );
    expect(rule2_result).toBeDefined();
    expect(rule2_result?.duplicate_count).toBe(1);
    expect(rule2_result?.rule_id).toBe('RULE-002');
    expect(rule2_result?.rule_name).toBe('電話番号完全一致重複判定');

    const rule3_result = result.rules_executed.find(
      (r) => r.rule_id === 'RULE-003'
    );
    expect(rule3_result).toBeDefined();
    expect(rule3_result?.duplicate_count).toBe(1);
    expect(rule3_result?.rule_id).toBe('RULE-003');
    expect(rule3_result?.rule_name).toBe('氏名読み仮名と住所完全一致重複判定');

    expect(result.validation_log).toHaveLength(3);
    expect(result.validation_log[0].status).toBe('completed');
    expect(result.validation_log[1].status).toBe('completed');
    expect(result.validation_log[2].status).toBe('completed');
  });
});