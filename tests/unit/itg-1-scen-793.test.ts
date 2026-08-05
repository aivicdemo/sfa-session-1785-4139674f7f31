import { describe, test, expect, beforeEach } from "@jest/globals";
import { classifyAndPrioritizeDetectedIssues } from "../../src/logic/it-1-br-2-1-1-1";

describe("AIエージェント推論精度の自動監視とアラート機能", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // SCEN-793
  test("問題検出結果の分類・優先度付け機能 - 重要度の値が定義済み分類値以外の場合、エラーになる", () => {
    const invalidInput = {
      detectedIssueId: "issue-001",
      issueType: "proposal_quality",
      description: "提案内容が標準プロセスから乖離している",
      severity: "極高",
      detectionTimestamp: "2024-01-15T10:30:00Z",
      affectedSalesRepId: "rep-123",
      confidenceScore: 0.92,
    };

    expect(() => classifyAndPrioritizeDetectedIssues(invalidInput)).toThrow(
      /重要度|ERR_INVALID_SEVERITY_VALUE/
    );
  });
});