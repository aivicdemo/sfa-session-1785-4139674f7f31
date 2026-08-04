import { validateCustomerExistenceForRecommendation } from '../../src/logic/it-1-br-3-1-1-1';

describe('推奨根拠可視化機能', () => {
  // SCEN-723
  test('推奨生成前データ完全性判定機能 - 顧客マスタに存在しない顧客IDが入力されたとき推奨生成不可と判定される', () => {
    const nonExistentCustomerId = 'CUST-999999';
    const dealConditions = {
      dealName: '新規提案案件',
      industry: 'IT',
      budget: 5000000,
    };

    expect(() =>
      validateCustomerExistenceForRecommendation(nonExistentCustomerId, dealConditions)
    ).toThrow(/顧客ID/);
  });
});