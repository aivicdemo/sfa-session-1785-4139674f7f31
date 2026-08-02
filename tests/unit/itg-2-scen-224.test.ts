import { applyNormalizationRule } from '../../src/logic/it-1-br-2-1-2-1';

describe('営業データ品質検証エンジン - 正規化ルール適用', () => {
  // SCEN-224
  test('正規化ルール適用エンジン - ルール適用による変換後のデータが正規化ルール定義と一致する', () => {
    const input_data = '09012345678';
    const rule_definition = {
      rule_id: 'phone_format_001',
      rule_name: '電話番号フォーマットルール',
      input_pattern: '^0\\d{10}$',
      output_format: '090-XXXX-XXXX',
      transformation: (value: string) => {
        return value.slice(0, 3) + '-' + value.slice(3, 7) + '-' + value.slice(7, 11);
      }
    };

    const result = applyNormalizationRule(input_data, rule_definition);

    expect(result).toBe('090-1234-5678');
  });
});