import { determineIssueResponseTiming } from "../../src/logic/it-1-br-2-1-1-1";

describe("AIエージェント推論精度の自動監視とアラート機能", () => {
  test("SCEN-542: [normal] 問題対応タイミングの判定機能 - 複数の問題がある場合、最も緊急度が高い問題に合わせた対応時期が指定される", () => {
    const issue_1 = {
      issue_id: "issue_001",
      severity_level: "Medium" as const,
      response_deadline_hours: 72,
    };

    const issue_2 = {
      issue_id: "issue_002",
      severity_level: "Critical" as const,
      response_deadline_hours: 4,
    };

    const issue_3 = {
      issue_id: "issue_003",
      severity_level: "High" as const,
      response_deadline_hours: 24,
    };

    const issues = [issue_1, issue_2, issue_3];

    const result = determineIssueResponseTiming(issues);

    expect(result.recommended_response_deadline_hours).toBe(4);
    expect(result.priority_severity_level).toBe("Critical");
    expect(result.target_issue_id).toBe("issue_002");
  });
});