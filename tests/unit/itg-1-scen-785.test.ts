import { classifyAndPrioritizeIssues } from "../../src/logic/it-1-br-2-1-1-1";

describe("AIエージェント推論精度の自動監視とアラート機能", () => {
  // SCEN-785
  test("問題検出結果の分類・優先度付け機能 - 問題オブジェクトの重要度が未設定・nullの場合、エラーになる", () => {
    const detectedIssues = [
      {
        issue_id: "issue_001",
        issue_type: "process_deviation",
        description: "営業プロセスからの乖離を検出",
        importance: null,
        frequency: 5,
        impact_level: "high",
        detected_at: "2024-01-15T10:00:00Z",
        sales_staff_id: "staff_001",
      },
    ];

    const input = {
      detected_issues: detectedIssues,
      priority_rules: {
        high_impact_threshold: 0.8,
        frequency_weight: 0.3,
        impact_weight: 0.7,
      },
    };

    expect(() => classifyAndPrioritizeIssues(input)).toThrow(/重要度/);
  });
});