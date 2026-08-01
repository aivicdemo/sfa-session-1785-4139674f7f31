import { evaluateProblemDetectionResults } from "../../src/logic/it-1-br-2-1-1-1";

describe("AIエージェント推論精度の自動監視とアラート機能", () => {
  // SCEN-587
  test("問題検出結果の重要度・対応必要性判定機能 - 対応必要性判定で報告対象と判定された件数が正確に集計される", () => {
    const problem_detection_results = [
      {
        detection_id: "det_001",
        severity: "high",
        action_required: "yes",
        report_target: false,
      },
      {
        detection_id: "det_002",
        severity: "high",
        action_required: "yes",
        report_target: false,
      },
      {
        detection_id: "det_003",
        severity: "high",
        action_required: "yes",
        report_target: false,
      },
      {
        detection_id: "det_004",
        severity: "high",
        action_required: "yes",
        report_target: false,
      },
      {
        detection_id: "det_005",
        severity: "high",
        action_required: "yes",
        report_target: false,
      },
      {
        detection_id: "det_006",
        severity: "high",
        action_required: "yes",
        report_target: false,
      },
      {
        detection_id: "det_007",
        severity: "low",
        action_required: "no",
        report_target: false,
      },
      {
        detection_id: "det_008",
        severity: "medium",
        action_required: "no",
        report_target: false,
      },
      {
        detection_id: "det_009",
        severity: "low",
        action_required: "no",
        report_target: false,
      },
      {
        detection_id: "det_010",
        severity: "medium",
        action_required: "no",
        report_target: false,
      },
    ];

    const result = evaluateProblemDetectionResults(
      problem_detection_results
    );

    expect(result.reportable_count).toBe(6);
    expect(result.total_count).toBe(10);
    expect(result.reportable_results).toHaveLength(6);
    expect(
      result.reportable_results.every(
        (item) => item.severity === "high" && item.action_required === "yes"
      )
    ).toBe(true);
  });
});