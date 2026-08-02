import { normalizeCustomerData } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-875
  test('正規化ルール適用順序が異なるとき、結果に影響が出ない', () => {
    const input_customer_data = '  山田 太郎  /YAMADA TARO  ';

    const result_a = normalizeCustomerData(input_customer_data, [
      'rule_1',
      'rule_2',
      'rule_3'
    ]);

    const result_b = normalizeCustomerData(input_customer_data, [
      'rule_3',
      'rule_1',
      'rule_2'
    ]);

    expect(result_a).toEqual({
      normalized_name_jp: '山田太郎',
      normalized_name_kana: 'ヤマダタロウ',
      normalized_name_roman: 'YAMADA TARO'
    });

    expect(result_b).toEqual({
      normalized_name_jp: '山田太郎',
      normalized_name_kana: 'ヤマダタロウ',
      normalized_name_roman: 'YAMADA TARO'
    });

    expect(result_a).toEqual(result_b);
  });
});