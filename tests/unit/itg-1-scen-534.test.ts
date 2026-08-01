import { determineIssueResponseTiming } from "../../src/logic/it-1-br-2-1-1-1";

describe("AIエージェント推論精度の自動監視とアラート機能", () => {
  // SCEN-534
  test("[normal] 問題対応タイミングの判定機能 - 緊急対応が必要な問題が検出された場合、対応時期として即座が指定される", () => {
    const urgentIssue = {
      issueId: "issue-001",
      severity: "high",
      requiresImmediateAction: true,
      description: "Critical inference accuracy degradation detected",
      detectedAt: new Date("2024-01-15T10:30:00Z"),
    };

    const result = determineIssueResponseTiming(urgentIssue);

    expect(result.responseTimingCategory).toBe("即座");
    expect(result.isProcessed).toBe(false);
  });
});