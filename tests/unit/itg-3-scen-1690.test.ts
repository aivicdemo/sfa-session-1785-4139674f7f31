import { generateRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('過去商談データから成功パターンを抽出し、新規案件の顧客・商談条件と照合して適用可能な提案アプローチを自動推奨する機能', () => {
  // SCEN-1690
  test('[error] 成功パターン抽出・照合機能 - 新規案件の商談条件が null のとき、エラーが発生する', () => {
    const customerId = 'CUST-001';
    const dealName = '新規提案案件';
    const dealConditions = null;

    expect(() => {
      generateRecommendation({
        customerId,
        dealName,
        dealConditions,
      });
    }).toThrow(/商談条件|dealConditions|INVALID_INPUT|MISSING_DEAL_CONDITIONS/);
  });
});