import { generateRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン抽出・照合・推奨機能', () => {
  // SCEN-1876
  test('顧客IDが空文字列のとき照合に失敗する', () => {
    const newDeal = {
      customerId: '',
      dealCondition: {
        industry: 'IT',
        scale: 'large',
        budget: 5000000,
      },
      productCategory: 'cloud-solution',
    };

    expect(() => generateRecommendation(newDeal)).toThrow(/顧客ID/);
  });
});