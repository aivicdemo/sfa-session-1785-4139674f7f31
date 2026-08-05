import { extractSuccessAndFailureFactors } from "../../src/logic/it-1-br-2-1-1-1";

describe("AIエージェント推論精度の自動監視とアラート機能", () => {
  // SCEN-973
  test("成功要因・失敗要因の抽出と承認判定機能 - 抽出された失敗要因がnullのとき、処理が進まずエラーになる", () => {
    const salesCaseId = "case_20240115_001";
    const successFactorsInput = {
      frequency: 5,
      proposalQuality: 8,
      followupInterval: 3,
      customerMatchScore: 9,
    };

    expect(() =>
      extractSuccessAndFailureFactors(salesCaseId, successFactorsInput)
    ).toThrow(/失敗要因/);
  });
});