import { evaluatePatternRelevance } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターンの適用可能性評価機能', () => {
  // SCEN-250
  test('顧客情報と商談条件が null のとき、エラーコード INVALID_INPUT_PARAMETERS を返す', () => {
    const invalidDealData = {
      customerId: null,
      dealConditions: null,
    };

    const result = evaluatePatternRelevance(invalidDealData);

    expect(result.errorCode).toBe('INVALID_INPUT_PARAMETERS');
    expect(result.errorMessage).toMatch(/顧客情報\（customerId\）と商談条件\（dealConditions\）は必須項目です/);
  });
});