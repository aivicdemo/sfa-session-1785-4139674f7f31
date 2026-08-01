import { determineReportingRequirementBySeverity } from "../../src/logic/it-1-br-2-1-1-1";

describe("AIエージェント推論精度の自動監視とアラート機能", () => {
  // SCEN-592
  test("重要度スコアが報告対象の閾値を超過する場合報告対象に判定される", () => {
    const severity_threshold = 80;
    const severity_score = 81;

    const problem_detection_result = {
      problem_id: "problem_001",
      severity_score: severity_score,
      severity_threshold: severity_threshold,
      detected_at: new Date("2024-01-15T10:30:00Z"),
    };

    const judgment_result = determineReportingRequirementBySeverity(
      problem_detection_result
    );

    expect(judgment_result.should_report).toBe(true);
    expect(judgment_result.action_requirement).toBe("報告対象");
  });
});