import { evaluateReasonApprovalCriteria } from "../../src/logic/it-1-br-2-1-1-1";

describe("AIエージェント推論精度の自動監視とアラート機能", () => {
  // SCEN-703
  test("成功・失敗要因の抽出と承認基準判定機能 - 要因テキストがnullのとき、承認基準判定で不適切と判定される", () => {
    const reasonData = {
      reasonText: null,
      reasonType: "success_factor",
      confidence: 0.85,
      frequency: 12,
      relatedCases: ["case_001", "case_002"],
    };

    const result = evaluateReasonApprovalCriteria(reasonData);

    expect(result.status).toMatch(/INAPPROPRIATE|REJECTED/);
    expect(result.errorMessage).toMatch(/要因テキストがnull/);
  });
});