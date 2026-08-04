import { evaluatePatternRelevance } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン自動判定機能 - 顧客属性バリデーション', () => {
  // SCEN-2630
  test('顧客属性が業務ルール外の値のとき、エラーが発生する', () => {
    const invalidCustomerAttribute = {
      customerType: 'INVALID_TYPE',
      industryCode: 9999,
      companySize: 'LARGE',
      region: 'JP',
    };

    expect(() => {
      evaluatePatternRelevance(invalidCustomerAttribute);
    }).toThrow(/顧客属性/);
  });
});