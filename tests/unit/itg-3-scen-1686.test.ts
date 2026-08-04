import { generateRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン抽出・照合機能', () => {
  // SCEN-1686
  test('過去商談データが null のとき、エラーが発生する', () => {
    const newDealInput = {
      customerId: 'CUST-001',
      customerIndustry: 'manufacturing',
      customerScale: 'large',
      dealStage: 'initial_proposal',
      dealAmount: 5000000,
      dealDescription: 'Enterprise ERP system implementation'
    };

    const pastDealsData = null;

    expect(() => {
      generateRecommendation(newDealInput, pastDealsData);
    }).toThrow(/過去商談データが利用不可/);
  });
});