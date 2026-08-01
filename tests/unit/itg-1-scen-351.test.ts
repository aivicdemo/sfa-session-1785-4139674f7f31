import { generateSalesRepAnalysisReport } from "../../src/logic/it-1-br-target4-1-1-1";

describe("営業担当者ごとの行動パターン分析レポート生成機能", () => {
  test("SCEN-351: 営業担当者の複数商談実績から成功・失敗パターンと成約率が正しく計算される", () => {
    const sales_rep_id = "SA001";
    const deal_records = [
      {
        deal_id: "DEAL001",
        sales_rep_id: "SA001",
        customer_id: "CUST001",
        deal_amount: 1000000,
        deal_status: "成功",
        created_date: "2024-01-10T10:00:00Z",
      },
      {
        deal_id: "DEAL002",
        sales_rep_id: "SA001",
        customer_id: "CUST002",
        deal_amount: 500000,
        deal_status: "失敗",
        created_date: "2024-01-15T11:00:00Z",
      },
      {
        deal_id: "DEAL003",
        sales_rep_id: "SA001",
        customer_id: "CUST003",
        deal_amount: 2000000,
        deal_status: "成功",
        created_date: "2024-01-20T12:00:00Z",
      },
      {
        deal_id: "DEAL004",
        sales_rep_id: "SA001",
        customer_id: "CUST004",
        deal_amount: 750000,
        deal_status: "失敗",
        created_date: "2024-01-25T13:00:00Z",
      },
      {
        deal_id: "DEAL005",
        sales_rep_id: "SA001",
        customer_id: "CUST005",
        deal_amount: 1500000,
        deal_status: "成功",
        created_date: "2024-02-01T14:00:00Z",
      },
    ];

    const report = generateSalesRepAnalysisReport(sales_rep_id, deal_records);

    expect(report.sales_rep_id).toBe("SA001");
    expect(report.success_pattern_count).toBe(3);
    expect(report.failure_pattern_count).toBe(2);
    expect(report.contract_rate).toBe(60.0);
  });
});