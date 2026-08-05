import { describe, test, expect } from "@jest/globals";
import { classifyAndPrioritizeDetectedIssues } from "../../src/logic/it-1-br-2-1-1-1";

describe("AIエージェント推論精度の自動監視とアラート機能", () => {
  // SCEN-789
  test("問題オブジェクトの検出内容が未設定の場合、ValidationErrorをスロー", () => {
    const invalidIssue = {
      issue_id: "ISS-001",
      detection_content: null,
      severity: "HIGH",
      impact_scope: "SINGLE_USER",
      priority_score: 0,
    };

    expect(() => classifyAndPrioritizeDetectedIssues(invalidIssue)).toThrow(/検出内容は必須項目です/);
  });
});