import { applyNormalizationRule } from '../../src/logic/it-1-br-2-1-2-1';

describe('営業データ品質検証エンジンの構築', () => {
  // SCEN-220
  test('正規化ルール適用エンジン - 正規化ルールが適用可能な状態のとき、データが変換される', () => {
    const input_data = '09012345678';
    const normalization_rule = {
      rule_id: 'phone_format',
      rule_name: '電話番号フォーマット',
      pattern: '###-####-####',
      is_active: true,
    };

    const result = applyNormalizationRule(input_data, normalization_rule);

    expect(result).toBe('090-1234-5678');
  });
});