import { analyzeTeamQualityByMonth } from "../../src/logic/it-1-br-2-1-1";

describe("チーム営業品質月次分析機能", () => {
  // SCEN-914
  test("過去3ヶ月の月別データで月初日が営業活動ログの記録日時の区切りとして正しく分類される", () => {
    const activity_logs = [
      {
        id: "log_001",
        recorded_at: "2024-09-01T00:00:00Z",
        sales_rep_id: "rep_001",
        activity_type: "visit",
        customer_id: "cust_001",
      },
      {
        id: "log_002",
        recorded_at: "2024-09-30T23:59:59Z",
        sales_rep_id: "rep_001",
        activity_type: "call",
        customer_id: "cust_002",
      },
      {
        id: "log_003",
        recorded_at: "2024-10-01T00:00:00Z",
        sales_rep_id: "rep_002",
        activity_type: "email",
        customer_id: "cust_003",
      },
      {
        id: "log_004",
        recorded_at: "2024-10-31T23:59:59Z",
        sales_rep_id: "rep_002",
        activity_type: "visit",
        customer_id: "cust_004",
      },
      {
        id: "log_005",
        recorded_at: "2024-11-01T00:00:00Z",
        sales_rep_id: "rep_001",
        activity_type: "call",
        customer_id: "cust_005",
      },
      {
        id: "log_006",
        recorded_at: "2024-11-15T12:00:00Z",
        sales_rep_id: "rep_002",
        activity_type: "visit",
        customer_id: "cust_006",
      },
    ];

    const current_month = "2024-11";
    const result = analyzeTeamQualityByMonth(activity_logs, current_month);

    expect(result.monthly_data).toHaveLength(3);

    const september_data = result.monthly_data.find(
      (m) => m.month === "2024-09"
    );
    expect(september_data).toBeDefined();
    expect(september_data?.log_count).toBe(2);
    expect(september_data?.log_ids).toEqual(["log_001", "log_002"]);

    const october_data = result.monthly_data.find((m) => m.month === "2024-10");
    expect(october_data).toBeDefined();
    expect(october_data?.log_count).toBe(2);
    expect(october_data?.log_ids).toEqual(["log_003", "log_004"]);

    const november_data = result.monthly_data.find(
      (m) => m.month === "2024-11"
    );
    expect(november_data).toBeDefined();
    expect(november_data?.log_count).toBe(2);
    expect(november_data?.log_ids).toEqual(["log_005", "log_006"]);

    expect(result.classification_boundary_validated).toBe(true);
    expect(result.cross_month_errors).toBe(0);
  });
});