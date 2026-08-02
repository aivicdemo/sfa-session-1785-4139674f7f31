import { normalizeCustomerData } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-108
  test('正規化ルールが適用され、特殊文字が統一される', () => {
    const input_records = [
      { customer_id: 1, customer_name: '山田・太郎' },
      { customer_id: 2, customer_name: '山田～太郎' },
      { customer_id: 3, customer_name: '山田＿太郎' },
    ];

    const normalization_rules = [
      {
        rule_id: 1,
        source_pattern: '・',
        target_char: '・',
        rule_priority: 1,
      },
      {
        rule_id: 2,
        source_pattern: '～',
        target_char: '・',
        rule_priority: 2,
      },
      {
        rule_id: 3,
        source_pattern: '＿',
        target_char: '・',
        rule_priority: 3,
      },
    ];

    const result = normalizeCustomerData({
      customer_records: input_records,
      normalization_rules: normalization_rules,
    });

    expect(result.normalized_records).toEqual([
      { customer_id: 1, customer_name: '山田・太郎' },
      { customer_id: 2, customer_name: '山田・太郎' },
      { customer_id: 3, customer_name: '山田・太郎' },
    ]);
    expect(result.normalization_status).toBe('completed');
    expect(result.transformed_count).toBe(3);
  });
});