import { applyNormalizationRules } from '../../src/logic/it-1-br-2-1-2-1';

describe('営業データ品質検証エンジン - 正規化ルール依存関係', () => {
  test('SCEN-190: ルール適用順序が逆順のとき依存関係により結果が異なる', () => {
    const normalizedRules = [
      {
        rule_id: 'rule_a',
        rule_name: '顧客名を大文字に変換',
        rule_type: 'uppercase',
        target_field: 'customer_name',
        depends_on: [],
        order: 1,
      },
      {
        rule_id: 'rule_b',
        rule_name: '顧客名の前後の空白を削除',
        rule_type: 'trim',
        target_field: 'customer_name',
        depends_on: ['rule_a'],
        order: 2,
      },
      {
        rule_id: 'rule_c',
        rule_name: '顧客名を小文字に変換',
        rule_type: 'lowercase',
        target_field: 'customer_name',
        depends_on: ['rule_b'],
        order: 3,
      },
    ];

    const inputData = {
      customer_id: 'cust_001',
      customer_name: '  SAMPLE  ',
    };

    // 正順実行（A → B → C）
    const normalOrderResult = applyNormalizationRules(inputData, normalizedRules);

    // 逆順実行（C → B → A）
    const reverseOrderedRules = [
      normalizedRules[2],
      normalizedRules[1],
      normalizedRules[0],
    ];
    const reverseOrderResult = applyNormalizationRules(
      inputData,
      reverseOrderedRules
    );

    // 正順実行の最終結果は「sample」
    expect(normalOrderResult.customer_name).toBe('sample');

    // 逆順実行の結果は正順実行と異なる（依存関係により「SAMPLE」または依存エラーが発生）
    expect(reverseOrderResult.customer_name).not.toBe('sample');
    // 逆順実行で依存関係が満たされない場合、元の値または中間値のいずれかが返される
    expect(['SAMPLE', '  SAMPLE  ']).toContain(reverseOrderResult.customer_name);
  });
});