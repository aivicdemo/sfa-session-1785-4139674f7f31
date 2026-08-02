import { applyNormalizationRules } from '../../src/logic/it-1-br-2-1-2-1';

describe('営業データ品質検証エンジン - 正規化ルール適用順序', () => {
  // SCEN-189
  test('複数件の正規化ルールが定義された順序で順次適用される', () => {
    const normalization_rules = [
      {
        rule_id: 'rule_001',
        rule_name: '先頭末尾スペース削除',
        rule_order: 1,
        rule_type: 'trim',
        rule_definition: { pattern: /^\s+|\s+$/g, replacement: '' },
      },
      {
        rule_id: 'rule_002',
        rule_name: '全角英数字を半角に変換',
        rule_order: 2,
        rule_type: 'zenkaku_to_hankaku',
        rule_definition: {
          pattern: /[Ａ-Ｚ]/g,
          replacement_map: {
            Ａ: 'A',
            Ｂ: 'B',
            Ｃ: 'C',
          },
        },
      },
      {
        rule_id: 'rule_003',
        rule_name: '大文字を小文字に統一',
        rule_order: 3,
        rule_type: 'lowercase',
        rule_definition: { pattern: /[A-Z]/g, replacement: 'lowercase' },
      },
    ];

    const input_data = '　ＡＢＣ　';

    const result = applyNormalizationRules({
      input_value: input_data,
      normalization_rules: normalization_rules,
    });

    expect(result).toBe('abc');
  });
});