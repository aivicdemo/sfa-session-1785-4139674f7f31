import { applyNormalizationRules } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-110
  test('正規化ルール設定が1件の場合、その1件のルールを適用する', () => {
    const normalization_rules = [
      {
        rule_id: 'RULE001',
        rule_name: '電話番号のハイフン削除',
        field_name: 'phone_number',
        rule_type: 'remove_delimiter',
        rule_config: { delimiter: '-' },
        is_active: true,
        priority: 1,
      },
    ];

    const customer_data = {
      customer_id: 'CUST001',
      customer_name: '山田太郎',
      phone_number: '090-1234-5678',
      email: 'yamada@example.com',
    };

    const result = applyNormalizationRules(customer_data, normalization_rules);

    expect(result.normalized_data.phone_number).toBe('09012345678');
    expect(result.normalized_data.customer_id).toBe('CUST001');
    expect(result.normalized_data.customer_name).toBe('山田太郎');
    expect(result.normalized_data.email).toBe('yamada@example.com');
    expect(result.applied_rules).toHaveLength(1);
    expect(result.applied_rules[0]).toEqual({
      rule_id: 'RULE001',
      field_name: 'phone_number',
      original_value: '090-1234-5678',
      normalized_value: '09012345678',
      status: '適用完了',
    });
    expect(result.rule_application_log).toContain('ルールID:RULE001 適用完了');
  });
});