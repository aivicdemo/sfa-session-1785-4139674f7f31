import { judgeApprovalCriteria } from "../../src/logic/it-1-br-2-1-1-1";

describe("AIエージェント推論精度の自動監視とアラート機能", () => {
  // SCEN-700
  test("成功・失敗要因の抽出と承認基準判定機能 - 失敗要因が1件のとき、承認基準判定が正しく処理される", () => {
    const failureFactors = [
      {
        factorId: "F001",
        factorName: "顧客ニーズ把握不足",
        importance: "高",
      },
    ];

    const result = judgeApprovalCriteria(failureFactors);

    expect(result.approvalStatus).toBe("承認可能");
    expect(result.approvalCriteriaLevel).toBe("要改善");
    expect(result.judgmentReason).toBe(
      "失敗要因が1件であり改善対象が明確なため承認可能"
    );
  });
});