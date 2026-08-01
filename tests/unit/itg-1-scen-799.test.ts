import { analyzeUserActivityPattern } from "../../src/logic/it-1-br-target4-1-1-1";

describe("営業担当者ごとの行動パターン分析レポート生成機能", () => {
  // SCEN-799
  test("営業活動ログが1件のとき、その1件の活動から行動パターンを抽出する", () => {
    const salesPersonId = "A001";
    const activityLogs = [
      {
        activity_id: "LOG001",
        sales_person_id: salesPersonId,
        activity_datetime: new Date("2024-01-15T10:30:00Z"),
        activity_type: "顧客訪問",
        activity_duration_minutes: 60,
        customer_id: "C123",
        product_category: "システム構築",
      },
    ];

    const result = analyzeUserActivityPattern({
      sales_person_id: salesPersonId,
      activity_logs: activityLogs,
    });

    expect(result.pattern_count).toBe(1);
    expect(result.patterns).toHaveLength(1);
    expect(result.patterns[0]).toEqual({
      pattern_type: "顧客訪問_単発",
      average_activity_duration_minutes: 60,
      activity_type_frequency: { "顧客訪問": 100 },
      unique_customer_count: 1,
      product_categories: ["システム構築"],
      analyzed_log_count: 1,
    });
  });
});