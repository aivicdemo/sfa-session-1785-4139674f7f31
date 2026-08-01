import { extractUnresolvedIssues } from "../../src/logic/it-1-br-2-1-1-1";

describe("AIエージェント推論精度の自動監視とアラート機能", () => {
  // SCEN-549
  test("対応すべき問題の抽出機能 - 問題の状態が未対応の場合、対応すべき問題として抽出される", () => {
    const issue_database = [
      {
        issue_id: "ISSUE-001",
        status: "未対応",
        priority: "高",
        reported_at: "2024-01-15",
      },
    ];

    const status_filter = "未対応";

    const extracted_issues = extractUnresolvedIssues(issue_database, status_filter);

    expect(extracted_issues).toHaveLength(1);
    expect(extracted_issues[0].issue_id).toBe("ISSUE-001");
    expect(extracted_issues[0].status).toBe("未対応");
    expect(extracted_issues[0].priority).toBe("高");
    expect(extracted_issues[0].reported_at).toBe("2024-01-15");
  });
});