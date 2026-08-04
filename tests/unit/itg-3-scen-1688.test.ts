import { extractAndMatchPatterns } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン抽出・照合機能', () => {
  // SCEN-1688
  test('新規案件の顧客条件が null のとき、エラーが発生する', () => {
    const newDealInput = {
      dealId: 'DEAL-001',
      dealName: '新規案件A',
      customerCondition: null,
      dealAmount: 5000000,
      industry: '製造業',
      companySize: '大企業',
    };

    expect(() => extractAndMatchPatterns(newDealInput)).toThrow(/顧客条件/);
  });
});