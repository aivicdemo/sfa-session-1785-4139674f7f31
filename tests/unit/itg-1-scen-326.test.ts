import { generateSalesActivityPatternAnalysisReport } from "../../src/logic/it-1-br-target4-1-1-1";

describe("営業担当者ごとの行動パターン分析レポート生成機能", () => {
  // SCEN-326
  test("営業活動ログが欠落している場合、該当レコードがスキップされる", () => {
    const sales_reps = [
      {
        sales_rep_id: "rep_001",
        sales_rep_name: "営業担当者A",
        activity_logs: [
          {
            visit_datetime: "2024-01-15T10:00:00Z",
            customer_name: "顧客X",
            activity_content: "初回訪問",
          },
          {
            visit_datetime: "2024-01-16T14:30:00Z",
            customer_name: "顧客Y",
            activity_content: "提案実施",
          },
        ],
      },
      {
        sales_rep_id: "rep_002",
        sales_rep_name: "営業担当者B",
        activity_logs: [],
      },
      {
        sales_rep_id: "rep_003",
        sales_rep_name: "営業担当者C",
        activity_logs: [
          {
            visit_datetime: "2024-01-17T09:00:00Z",
            customer_name: "顧客Z",
            activity_content: "フォローアップ",
          },
        ],
      },
    ];

    const report = generateSalesActivityPatternAnalysisReport(sales_reps);

    expect(report.included_records).toBe(2);
    expect(report.skipped_records).toBe(1);
    expect(report.patterns).toHaveLength(2);
    expect(report.patterns[0].sales_rep_id).toBe("rep_001");
    expect(report.patterns[0].sales_rep_name).toBe("営業担当者A");
    expect(report.patterns[0].activity_log_count).toBe(2);
    expect(report.patterns[1].sales_rep_id).toBe("rep_003");
    expect(report.patterns[1].sales_rep_name).toBe("営業担当者C");
    expect(report.patterns[1].activity_log_count).toBe(1);
  });
});