import { classifyAndSortDetectedIssues } from "../../src/logic/it-1-br-2-1-1-1";

describe("AIエージェント推論精度の自動監視とアラート機能", () => {
  test("SCEN-522: 問題検出結果の重要度・優先度分類機能 - 複数の問題が検出された場合、重要度が高い順に並べ替えられる", () => {
    const issue1 = {
      id: "issue_1",
      severity: "low",
      priority: 3,
      description: "Low severity issue",
      detectedAt: "2024-01-15T10:00:00Z",
    };

    const issue2 = {
      id: "issue_2",
      severity: "high",
      priority: 1,
      description: "High severity issue",
      detectedAt: "2024-01-15T10:05:00Z",
    };

    const issue3 = {
      id: "issue_3",
      severity: "medium",
      priority: 2,
      description: "Medium severity issue",
      detectedAt: "2024-01-15T10:10:00Z",
    };

    const issueList = [issue1, issue2, issue3];

    const result = classifyAndSortDetectedIssues(issueList);

    expect(result).toHaveLength(3);
    expect(result[0].id).toBe("issue_2");
    expect(result[0].severity).toBe("high");
    expect(result[0].priority).toBe(1);
    expect(result[1].id).toBe("issue_3");
    expect(result[1].severity).toBe("medium");
    expect(result[1].priority).toBe(2);
    expect(result[2].id).toBe("issue_1");
    expect(result[2].severity).toBe("low");
    expect(result[2].priority).toBe(3);
  });
});