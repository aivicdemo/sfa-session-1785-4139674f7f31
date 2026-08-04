import { validateRecommendationInput } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン抽出・照合機能', () => {
  // SCEN-1689
  test('新規案件の顧客条件が空オブジェクトのとき、エラーが発生する', () => {
    const emptyCustomerConditions = {};

    const inputData = {
      customerConditions: emptyCustomerConditions,
      dealStage: 'initial_proposal',
      productCategory: 'software',
    };

    expect(() => validateRecommendationInput(inputData)).toThrow(/顧客条件/);
  });
});