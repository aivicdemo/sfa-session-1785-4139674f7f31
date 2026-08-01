import { evaluateApprovalCriteria } from "../../src/logic/it-1-br-2-1-1-1";

describe("AIエージェント推論精度の自動監視とアラート機能", () => {
  // SCEN-712
  test("成功・失敗要因の抽出と承認基準判定機能 - 抽出要因の言語化品質スコアが0のとき、承認基準判定で不適切と判定される", () => {
    const extractedFactor = {
      factorId: "factor_001",
      factorType: "success",
      description: "顧客との初回接触時に詳細なニーズヒアリングを実施",
      verbalizationQualityScore: 0,
      extractedAt: new Date("2024-01-15T10:00:00Z"),
    };

    const approvalResult = evaluateApprovalCriteria(extractedFactor);

    expect(approvalResult.judgmentStatus).toBe("rejected");
    expect(approvalResult.isAppropriate).toBe(false);
    expect(approvalResult.rejectionReason).toMatch(/言語化品質スコアが基準値未満です/);
  });
});