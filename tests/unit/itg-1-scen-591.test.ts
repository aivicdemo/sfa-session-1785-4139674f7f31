import { calculateIssueImportanceScore } from "../../src/logic/it-1-br-2-1-1-1";

describe("AIエージェント推論精度の自動監視とアラート機能", () => {
  // SCEN-591
  test("重要度スコアが報告対象の閾値未満の場合報告非対象に判定される", () => {
    const REPORT_THRESHOLD = 50;
    const ISSUE_IMPORTANCE_SCORE_BELOW_THRESHOLD = 49;

    const detectionResult = {
      issueId: "ISSUE-001",
      detectedAt: new Date("2024-01-15T11:00:00Z"),
      severity: "medium",
      affectedArea: "proposal_content",
      inferenceConfidence: 0.85,
      issueImportanceScore: ISSUE_IMPORTANCE_SCORE_BELOW_THRESHOLD,
      reportingThreshold: REPORT_THRESHOLD,
    };

    const judgmentResult = calculateIssueImportanceScore(detectionResult);

    expect(judgmentResult.shouldReport).toBe(false);
    expect(judgmentResult.reportingFlag).toBe(false);
    expect(judgmentResult.issueImportanceScore).toBe(
      ISSUE_IMPORTANCE_SCORE_BELOW_THRESHOLD
    );
  });
});