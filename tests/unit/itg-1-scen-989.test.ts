import { evaluateApprovalCriteria } from "../../src/logic/it-1-br-2-1-1-1";

describe("AIエージェント推論精度の自動監視とアラート機能", () => {
  test("SCEN-989: 成功要因・失敗要因の抽出と承認基準判定 - 要因数が上限値と同一のとき承認不可と判定", () => {
    // 承認基準の上限値を50件と設定
    const approval_criteria_max_factors = 50;

    // テストデータ: 抽出された成功要因・失敗要因の総数が50件（上限値と同一）
    const extracted_success_factors = Array.from({ length: 25 }, (_, i) => ({
      factor_id: `success_${i + 1}`,
      factor_name: `Success Factor ${i + 1}`,
      occurrence_count: 5,
    }));

    const extracted_failure_factors = Array.from({ length: 25 }, (_, i) => ({
      factor_id: `failure_${i + 1}`,
      factor_name: `Failure Factor ${i + 1}`,
      occurrence_count: 3,
    }));

    const total_extracted_factors =
      extracted_success_factors.length + extracted_failure_factors.length;

    // 承認基準判定ロジックを実行
    const approval_result = evaluateApprovalCriteria({
      extracted_success_factors,
      extracted_failure_factors,
      approval_criteria_max_factors,
    });

    // 期待結果: 要因数が50件（上限値）のとき、承認不可（reject）と判定される
    expect(approval_result.approval_status).toBe("reject");
    expect(approval_result.is_approved).toBe(false);
    expect(total_extracted_factors).toBe(50);
  });
});