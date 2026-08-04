import { evaluatePatternRelevance } from "../../src/logic/it-1-br-3-3-2-1";

describe("成功パターン適用可能性評価", () => {
  // SCEN-2152
  test("新規案件の条件が空オブジェクトのとき、エラーが発生する", () => {
    const emptyConditions = {};

    expect(() => evaluatePatternRelevance(emptyConditions)).toThrow(
      /新規案件の条件は必須です|顧客情報・商談条件が不足しています/
    );
  });
});