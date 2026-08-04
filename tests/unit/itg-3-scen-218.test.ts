import { generateRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('過去商談データから成功パターンを抽出し、新規案件の顧客・商談条件と照合して適用可能な提案アプローチを自動推奨する機能', () => {
  // SCEN-218
  test('新規案件の商談条件が空オブジェクトのとき、推奨処理がエラーになる', () => {
    const emptyDealConditions = {};

    expect(() => generateRecommendation(emptyDealConditions)).toThrow(/商談条件/);
  });
});