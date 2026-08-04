import { findSimilarPatterns } from "../../src/logic/it-1-br-3-3-2-1";

describe("過去商談データから成功パターンを抽出し、新規案件の顧客・商談条件と照合して適用可能な提案アプローチを自動推奨する機能", () => {
  // SCEN-2144
  test("類似パターン検索とランク付け - 現在の商談条件が空オブジェクトのとき、エラーが発生する", () => {
    const emptyDealCondition = {};

    expect(() => findSimilarPatterns(emptyDealCondition)).toThrow(/商談条件/);
  });
});