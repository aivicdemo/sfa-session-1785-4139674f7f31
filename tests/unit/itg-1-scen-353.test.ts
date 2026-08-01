import { generateActivityPatternAnalysisReport } from "../../src/logic/it-1-br-target4-1-1-1";

describe("営業担当者ごとの行動パターン分析レポート生成機能", () => {
  // SCEN-353
  test("営業担当者の行動ログが1件のとき、行動パターンが正しく抽出される", () => {
    const sales_staff_id = "001";
    const activity_log = [
      {
        activity_log_id: "AL001",
        sales_staff_id: "001",
        customer_id: "C001",
        activity_type: "顧客訪問",
        activity_datetime: "2024-01-15T10:00:00Z",
        duration_minutes: 30,
      },
    ];

    const report = generateActivityPatternAnalysisReport({
      sales_staff_id,
      activity_logs: activity_log,
    });

    expect(report.sales_staff_id).toBe("001");
    expect(report.total_activity_count).toBe(1);
    expect(report.activity_patterns).toHaveLength(1);
    expect(report.activity_patterns[0].pattern_type).toBe("顧客訪問");
    expect(report.activity_patterns[0].pattern_count).toBe(1);
    expect(report.activity_patterns[0].activities).toHaveLength(1);
    expect(report.activity_patterns[0].activities[0].customer_id).toBe("C001");
    expect(report.activity_patterns[0].activities[0].duration_minutes).toBe(30);
    expect(report.activity_patterns[0].activities[0].activity_datetime).toBe(
      "2024-01-15T10:00:00Z"
    );
  });
});