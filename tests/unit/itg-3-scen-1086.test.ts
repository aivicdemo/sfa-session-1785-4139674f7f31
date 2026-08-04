import { generateRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン抽出・照合機能', () => {
  // SCEN-1086
  test('新規案件の顧客条件がnullのとき、推奨生成処理がエラーになる', () => {
    const newDealWithNullCustomerConditions = {
      dealId: 'DEAL-20240115-001',
      customerConditions: null,
      dealAmount: 5000000,
      industry: '製造業',
      company_size: '中堅企業',
    };

    expect(() =>
      generateRecommendation(newDealWithNullCustomerConditions)
    ).toThrow(/customerConditions/);
  });
});