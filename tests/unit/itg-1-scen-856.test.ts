import { calculateProblemSeverityAndNecessity } from "../../src/logic/it-1-br-2-1-1-1";

describe("AIエージェント推論精度の自動監視とアラート機能", () => {
  // SCEN-856
  test("問題検出結果の重要度・根拠・対応必要性判定機能 - 検出期間が月初日を含むとき期間判定が正確に行われる", () => {
    const detection_start_date = new Date("2024-01-01T00:00:00Z");
    const detection_end_date = new Date("2024-01-15T23:59:59Z");
    const problem_pattern = "proposal_deviation";
    const deviation_score = 42;
    const customer_impact_level = "high";
    const detected_issue_count = 3;

    const result = calculateProblemSeverityAndNecessity({
      detection_start_date,
      detection_end_date,
      problem_pattern,
      deviation_score,
      customer_impact_level,
      detected_issue_count,
    });

    expect(result.includes_month_start).toBe(true);
    expect(result.severity_level).toBe("high");
    expect(result.action_necessity).toBe("required");
    expect(result.priority_score).toBe(78);
    expect(result.root_cause_detected).toBe(true);
    expect(result.recommended_action).toMatch(/process_standard|customer_follow/);
  });
});