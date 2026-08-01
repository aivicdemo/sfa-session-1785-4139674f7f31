import {
  generateSalesActivityPatternAnalysisReport,
} from "../../src/logic/it-1-br-target4-1-1-1";

describe("営業担当者ごとの行動パターン分析レポート生成機能", () => {
  // SCEN-314
  test("指定期間内に営業活動ログが1件の場合、行動パターンが正常に分析される", () => {
    const sales_rep_id = "USER001";
    const analysis_start_date = "2024-01-01";
    const analysis_end_date = "2024-01-31";

    const activity_logs = [
      {
        activity_id: "ACT001",
        sales_rep_id: sales_rep_id,
        activity_type: "顧客訪問",
        activity_date_time: "2024-01-15T10:30:00Z",
        customer_id: "CUST001",
        duration_minutes: 30,
      },
    ];

    const report = generateSalesActivityPatternAnalysisReport({
      sales_rep_id: sales_rep_id,
      analysis_start_date: analysis_start_date,
      analysis_end_date: analysis_end_date,
      activity_logs: activity_logs,
    });

    expect(report.sales_rep_id).toBe("USER001");
    expect(report.analysis_period_start).toBe("2024-01-01");
    expect(report.analysis_period_end).toBe("2024-01-31");
    expect(report.total_activity_count).toBe(1);
    expect(report.activity_type_breakdown).toEqual({
      顧客訪問: 1,
    });
    expect(report.average_activity_interval_days).toBe(null);
    expect(report.behavior_pattern_classification).toBe("単発活動");
    expect(report.report_generation_status).toBe("成功");
  });
});