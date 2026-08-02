import { detectDuplicateAndNormalize } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-1134
  test('正規化後の顧客電話番号が一致する場合、重複候補として判定される', () => {
    const customer_a = {
      customer_id: 'CUST001',
      name: '顧客A',
      phone_number: '090-1234-5678',
    };

    const customer_b = {
      customer_id: 'CUST002',
      name: '顧客B',
      phone_number: '09012345678',
    };

    const normalization_rules = [
      {
        field_name: 'phone_number',
        rule_type: 'remove_chars',
        chars_to_remove: ['-', ' ', '(', ')'],
      },
    ];

    const result = detectDuplicateAndNormalize(
      customer_a,
      customer_b,
      normalization_rules
    );

    expect(result.is_duplicate).toBe(true);
    expect(result.duplicate_reason).toBe('正規化電話番号一致');
    expect(result.matched_field).toBe('phone_number_normalized');
    expect(result.customer_a_id).toBe('CUST001');
    expect(result.customer_b_id).toBe('CUST002');
  });
});