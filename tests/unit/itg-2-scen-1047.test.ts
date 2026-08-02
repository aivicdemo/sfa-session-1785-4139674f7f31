import { applyNormalizationRules } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用', () => {
  // SCEN-1047
  test('複数の正規化ルールが同じ項目に適用可能である場合に優先度の高いルールが適用される', () => {
    const normalizationRules = [
      {
        rule_id: 'rule_001',
        target_field: 'phone_number',
        rule_name: '電話番号から記号を除去する',
        priority: 1,
        rule_type: 'remove_symbols',
        transformation: (value: string) => value.replace(/[\s\-\+]/g, ''),
        created_at: new Date('2024-01-01T00:00:00Z'),
      },
      {
        rule_id: 'rule_002',
        target_field: 'phone_number',
        rule_name: '電話番号を国番号付きフォーマットに統一する',
        priority: 2,
        rule_type: 'format_international',
        transformation: (value: string) => `+${value.replace(/\D/g, '').slice(-10)}`,
        created_at: new Date('2024-01-02T00:00:00Z'),
      },
      {
        rule_id: 'rule_003',
        target_field: 'phone_number',
        rule_name: '電話番号の前後の空白を削除する',
        priority: 3,
        rule_type: 'trim_whitespace',
        transformation: (value: string) => value.trim(),
        created_at: new Date('2024-01-03T00:00:00Z'),
      },
    ];

    const customerData = {
      customer_id: 'CUST_20240115_001',
      customer_name: 'テスト顧客太郎',
      phone_number: ' +81-90-1234-5678 ',
    };

    const result = applyNormalizationRules(customerData, normalizationRules);

    expect(result.normalized_data.phone_number).toBe('819012345678');
    expect(result.applied_rules).toEqual([
      {
        rule_id: 'rule_001',
        rule_name: '電話番号から記号を除去する',
        priority: 1,
      },
    ]);
    expect(result.applied_rules.length).toBe(1);
    expect(result.processing_history).toContain('優先度1ルール適用');
  });
});