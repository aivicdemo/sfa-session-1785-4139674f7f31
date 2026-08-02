import { detectDuplicateCustomers } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-406
  test('不整合検出が1件の場合、その1件の不整合が報告される', () => {
    const input_customers = [
      {
        customer_id: 'C001',
        customer_name: 'Customer A',
        phone_number: '090-1234-5678',
        email: 'customerA@example.com',
        address: 'Tokyo',
      },
      {
        customer_id: 'C002',
        customer_name: 'Customer B',
        phone_number: '090-1234-5678',
        email: 'customerB@example.com',
        address: 'Osaka',
      },
    ];

    const input_duplication_rules = [
      {
        rule_id: 'RULE_001',
        rule_name: '電話番号完全一致',
        matching_field: 'phone_number',
        matching_type: 'exact',
        priority: 1,
      },
    ];

    const result = detectDuplicateCustomers(
      input_customers,
      input_duplication_rules,
    );

    expect(result.inconsistencies.length).toBe(1);

    const detected_inconsistency = result.inconsistencies[0];
    expect(detected_inconsistency.inconsistency_type).toBe('重複');
    expect(detected_inconsistency.customer_id_primary).toBe('C001');
    expect(detected_inconsistency.customer_id_duplicate).toBe('C002');
    expect(detected_inconsistency.duplicate_reason).toBe('電話番号完全一致');
    expect(detected_inconsistency.duplicate_field).toBe('phone_number');
    expect(detected_inconsistency.duplicate_value).toBe('090-1234-5678');
    expect(detected_inconsistency.matched_rule_id).toBe('RULE_001');
  });
});