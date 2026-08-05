import { classifyDetectedIssues } from "../../src/logic/it-1-br-2-1-1-1";

describe("AIエージェント推論精度の自動監視とアラート機能", () => {
  // SCEN-802
  test("問題検出結果の重要度・優先度分類機能 - 検出問題数が閾値未満の時、分類ロジックが正しく動作する", () => {
    const detected_issues = [
      {
        issue_id: "ISS-001",
        issue_content: "提案内容がプロセス標準から20%乖離",
        detected_timestamp: new Date("2024-01-15T10:30:00Z"),
        importance_level: "high",
        priority_order: 1,
      },
      {
        issue_id: "ISS-002",
        issue_content: "顧客対応パターンが成功パターンと不一致",
        detected_timestamp: new Date("2024-01-15T10:35:00Z"),
        importance_level: "high",
        priority_order: 2,
      },
      {
        issue_id: "ISS-003",
        issue_content: "フォローアップ間隔が標準値超過",
        detected_timestamp: new Date("2024-01-15T10:40:00Z"),
        importance_level: "high",
        priority_order: 3,
      },
      {
        issue_id: "ISS-004",
        issue_content: "顧客データ品質スコア低下",
        detected_timestamp: new Date("2024-01-15T10:45:00Z"),
        importance_level: "medium",
        priority_order: 4,
      },
      {
        issue_id: "ISS-005",
        issue_content: "提案資料の形式不統一",
        detected_timestamp: new Date("2024-01-15T10:50:00Z"),
        importance_level: "medium",
        priority_order: 5,
      },
      {
        issue_id: "ISS-006",
        issue_content: "営業プロセス記録の遅延入力",
        detected_timestamp: new Date("2024-01-15T10:55:00Z"),
        importance_level: "medium",
        priority_order: 6,
      },
      {
        issue_id: "ISS-007",
        issue_content: "初回接触から提案までの期間が短縮",
        detected_timestamp: new Date("2024-01-15T11:00:00Z"),
        importance_level: "medium",
        priority_order: 7,
      },
      {
        issue_id: "ISS-008",
        issue_content: "顧客ニーズ分析が不十分",
        detected_timestamp: new Date("2024-01-15T11:05:00Z"),
        importance_level: "low",
        priority_order: 8,
      },
      {
        issue_id: "ISS-009",
        issue_content: "提案書に誤字・脱字の可能性",
        detected_timestamp: new Date("2024-01-15T11:10:00Z"),
        importance_level: "low",
        priority_order: 9,
      },
    ];

    const system_config = {
      issue_threshold: 10,
    };

    const classification_result = classifyDetectedIssues(
      detected_issues,
      system_config
    );

    expect(classification_result.high_importance).toHaveLength(3);
    expect(classification_result.medium_importance).toHaveLength(4);
    expect(classification_result.low_importance).toHaveLength(2);

    expect(classification_result.high_importance).toEqual([
      detected_issues[0],
      detected_issues[1],
      detected_issues[2],
    ]);

    expect(classification_result.medium_importance).toEqual([
      detected_issues[3],
      detected_issues[4],
      detected_issues[5],
      detected_issues[6],
    ]);

    expect(classification_result.low_importance).toEqual([
      detected_issues[7],
      detected_issues[8],
    ]);

    const total_issues_after_classification =
      classification_result.high_importance.length +
      classification_result.medium_importance.length +
      classification_result.low_importance.length;

    expect(total_issues_after_classification).toBe(9);

    expect(classification_result.high_importance[0].issue_id).toBe("ISS-001");
    expect(classification_result.high_importance[0].issue_content).toBe(
      "提案内容がプロセス標準から20%乖離"
    );
    expect(classification_result.high_importance[0].importance_level).toBe(
      "high"
    );

    expect(classification_result.medium_importance[0].issue_id).toBe("ISS-004");
    expect(classification_result.medium_importance[0].importance_level).toBe(
      "medium"
    );

    expect(classification_result.low_importance[0].issue_id).toBe("ISS-008");
    expect(classification_result.low_importance[0].importance_level).toBe(
      "low"
    );
  });
});