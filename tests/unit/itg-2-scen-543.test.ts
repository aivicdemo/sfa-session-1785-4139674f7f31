import { applyNormalizationRules } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データ重複検出・分類機能 - 正規化ルール適用', () => {
  // SCEN-543
  test('正規化ルールが複数件のとき、優先度順に全ルールを適用して変換結果を記録する', () => {
    const input_customer_data = ' ABC-123 def ';
    const normalization_rules = [
      {
        rule_id: 'rule_001',
        priority: 1,
        rule_name: 'スペース削除',
        rule_pattern: 'TRIM_SPACES',
        rule_config: {}
      },
      {
        rule_id: 'rule_002',
        priority: 2,
        rule_name: '大文字変換',
        rule_pattern: 'UPPERCASE',
        rule_config: {}
      },
      {
        rule_id: 'rule_003',
        priority: 3,
        rule_name: '特殊文字除去',
        rule_pattern: 'REMOVE_SPECIAL_CHARS',
        rule_config: {}
      }
    ];

    const result = applyNormalizationRules({
      input_data: input_customer_data,
      rules: normalization_rules
    });

    expect(result.final_output).toBe('ABC123DEF');

    expect(result.transformation_history).toEqual([
      {
        step: 1,
        rule_id: 'rule_001',
        rule_name: 'スペース削除',
        input_value: ' ABC-123 def ',
        output_value: 'ABC-123def',
        priority: 1
      },
      {
        step: 2,
        rule_id: 'rule_002',
        rule_name: '大文字変換',
        input_value: 'ABC-123def',
        output_value: 'ABC-123DEF',
        priority: 2
      },
      {
        step: 3,
        rule_id: 'rule_003',
        rule_name: '特殊文字除去',
        input_value: 'ABC-123DEF',
        output_value: 'ABC123DEF',
        priority: 3
      }
    ]);

    expect(result.transformation_history.length).toBe(3);
    expect(result.transformation_history[0].output_value).toBe('ABC-123def');
    expect(result.transformation_history[1].output_value).toBe('ABC-123DEF');
    expect(result.transformation_history[2].output_value).toBe('ABC123DEF');
  });
});