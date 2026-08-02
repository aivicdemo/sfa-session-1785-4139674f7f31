import { applyNormalizationRules } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-463
  test('正規化ルールが複数件の場合、全ての規則が順序通りに適用される', () => {
    const normalization_rules = [
      {
        rule_id: 'rule_001',
        rule_order: 1,
        rule_type: 'remove_full_width_spaces',
        rule_pattern: '　',
        replacement_value: '',
        status: 'active'
      },
      {
        rule_id: 'rule_002',
        rule_order: 2,
        rule_type: 'katakana_to_hiragana',
        rule_pattern: 'カタカナ',
        replacement_value: 'ひらがな',
        status: 'active'
      },
      {
        rule_id: 'rule_003',
        rule_order: 3,
        rule_type: 'trim_whitespace',
        rule_pattern: '^\\s+|\\s+$',
        replacement_value: '',
        status: 'active'
      }
    ];

    const input_customer_data = '　カタカナ　';

    const result = applyNormalizationRules(
      input_customer_data,
      normalization_rules
    );

    expect(result).toBe('ひらがな');
  });
});