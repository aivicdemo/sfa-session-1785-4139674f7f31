import { applyNormalizationRules } from '../../src/logic/it-1-br-2-1-2-1';

describe('営業データ品質検証エンジンの構築', () => {
  // SCEN-222
  test('正規化ルール適用エンジン - ルール適用対象データが空のとき、エラーが発生する', () => {
    const emptyData: any[] = [];
    const normalizationRules = [
      {
        rule_id: 'RULE_001',
        field_name: 'customer_name',
        normalization_type: 'TRIM',
        priority: 1,
        is_active: true,
      },
    ];

    expect(() =>
      applyNormalizationRules({
        target_data: emptyData,
        normalization_rules: normalizationRules,
      })
    ).toThrow(/ルール適用対象データが空/);
  });
});