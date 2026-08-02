import { detectDuplicateCustomersAndApplyNormalization } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-392
  test('正規化ルールが1件の場合、その1件のルールが適用される', () => {
    const normalizationRule = {
      rule_id: 'RULE_001',
      rule_name: '電話番号フォーマット統一ルール',
      target_field: 'phone_number',
      normalization_logic: (value: string) => value.replace(/[^\d]/g, ''),
      priority: 1,
      created_at: new Date('2024-01-15T10:00:00Z'),
      updated_at: new Date('2024-01-15T10:00:00Z'),
    };

    const customerData = [
      {
        customer_id: 'CUST_001',
        customer_name: '太郎商事',
        phone_number: '090-1234-5678',
        email: 'taro@example.com',
        created_at: new Date('2024-01-10T09:00:00Z'),
      },
      {
        customer_id: 'CUST_002',
        customer_name: '太郎商事',
        phone_number: '09012345678',
        email: 'taro@example.com',
        created_at: new Date('2024-01-12T14:30:00Z'),
      },
    ];

    const result = detectDuplicateCustomersAndApplyNormalization(
      customerData,
      [normalizationRule],
    );

    expect(result.applied_rules_count).toBe(1);
    expect(result.applied_rule_ids).toContain('RULE_001');
    expect(result.normalized_customer_data.length).toBe(2);
    expect(result.normalized_customer_data[0].phone_number).toBe('09012345678');
    expect(result.normalized_customer_data[1].phone_number).toBe('09012345678');
    expect(result.duplicate_candidates.length).toBeGreaterThan(0);
    expect(result.duplicate_candidates[0].primary_customer_id).toBe('CUST_001');
    expect(result.duplicate_candidates[0].duplicate_customer_id).toBe('CUST_002');
    expect(result.duplicate_candidates[0].match_score).toBeGreaterThanOrEqual(0.8);
    expect(result.integration_decision_status).toBe('判定完了');
  });
});