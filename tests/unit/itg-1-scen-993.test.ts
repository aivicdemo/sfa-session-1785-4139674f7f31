import { extractSuccessAndFailureFactors } from "../../src/logic/it-1-br-2-1-1-1";

describe("AIエージェント推論精度の自動監視とアラート機能", () => {
  // SCEN-993: [edge] 成功要因・失敗要因の抽出と承認基準判定機能 - ワークショップ参加者数が承認基準の下限ちょうどのとき要因抽出が進行可能と判定される
  test("ワークショップ参加者数が承認基準下限値（3名）と完全に一致する場合、要因抽出処理が進行可能と判定され、ステータスが承認済みまたは処理中に遷移される", () => {
    const workshop_participant_count = 3;
    const approval_criteria_minimum = 3;
    const workshop_id = "ws_001";
    const workshop_name = "営業事例分類ワークショップ";
    const success_factors = ["顧客ニーズの早期把握", "提案タイミングの最適化"];
    const failure_factors = ["フォローアップ間隔が長い", "提案内容の標準化不足"];
    const extracted_by_user_id = "user_mgr_001";
    const extraction_timestamp = new Date("2024-01-15T10:30:00Z");

    const result = extractSuccessAndFailureFactors({
      workshop_id,
      workshop_name,
      participant_count: workshop_participant_count,
      approval_criteria_minimum,
      success_factors,
      failure_factors,
      extracted_by_user_id,
      extraction_timestamp,
    });

    expect(result.can_proceed).toBe(true);
    expect(result.status).toMatch(/承認済み|処理中/);
    expect(result.participant_count_meets_criteria).toBe(true);
    expect(result.approval_decision).toBe("承認済み");
  });
});