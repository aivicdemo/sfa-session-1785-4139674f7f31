import { describe, test, expect } from "@jest/globals";
import { classifyAndPrioritizeIssues } from "../../src/logic/it-1-br-2-1-1-1";

describe("AIエージェント推論精度の自動監視とアラート機能", () => {
  test("SCEN-788: 問題オブジェクトの優先度が空文字列の場合、エラーになる", () => {
    const issue_with_empty_priority = {
      issue_id: "issue_001",
      category: "process_deviation",
      description: "営業プロセスからの乖離を検出",
      severity: "high",
      priority: "",
      detected_at: new Date("2024-01-15T10:00:00Z"),
      affected_user_id: "user_123",
    };

    expect(() =>
      classifyAndPrioritizeIssues([issue_with_empty_priority])
    ).toThrow(/優先度|Priority/);
  });
});