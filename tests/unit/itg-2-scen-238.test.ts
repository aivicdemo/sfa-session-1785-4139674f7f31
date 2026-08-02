import { requirementSpecificationConversion } from '../../src/logic/it-1-br-2-1-2-1';

describe('営業データ品質検証エンジンの構築', () => {
  // SCEN-238
  test('判定基準が欠けているとき、要件仕様変換処理がエラーになる', () => {
    const engineConfig = {
      criteria: null,
      dataSourceId: 'src-001',
      validationRuleSetId: 'rules-001',
    };

    expect(() => requirementSpecificationConversion(engineConfig)).toThrow(/判定基準/);
  });
});