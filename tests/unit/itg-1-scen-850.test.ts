import { calculateIssueResolutionRequirement } from "../../src/logic/it-1-br-2-1-1-1";

describe("AIエージェント推論精度の自動監視とアラート機能", () => {
  test("SCEN-850: 対応期間制約が対応可能期間上限超の場合に対応不可と判定される", () => {
    const detectedIssue = {
      issueId: "issue_20240115_001",
      severity: "high" as const,
      resolutionConstraintDays: 31,
      detectedAt: new Date("2024-01-15T10:30:00Z"),
      rootCause: "AIエージェント推論精度が目標値から15%低下",
      affectedProcesses: ["提案内容分析", "顧客対応パターン検出"],
    };

    const systemConfig = {
      maxResolvableDays: 30,
      criticalityThreshold: 0.8,
    };

    const result = calculateIssueResolutionRequirement(
      detectedIssue,
      systemConfig
    );

    expect(result.isResolutionRequired).toBe(false);
    expect(result.status).toBe("UNRESOLVABLE");
    expect(result.resolutionReason).toMatch(/対応期間制約.*31.*日.*対応可能期間上限.*30.*日.*超過/);
  });
});