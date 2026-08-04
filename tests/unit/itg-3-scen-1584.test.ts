import { generateRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン適用推奨機能', () => {
  test('SCEN-1584: 商談条件の金額が負の値のとき、エラーが発生する', () => {
    const invalidDealCondition = {
      customerName: '株式会社ABC',
      productName: '営業管理システム',
      dealAmount: -100000,
      industry: '製造業',
      companySize: '中規模',
    };

    expect(() => generateRecommendation(invalidDealCondition)).toThrow(/商談金額/);
  });
});