import { describe, test, expect } from "@jest/globals";
import { generateSalesPersonBehaviorAnalysisReport } from "../../src/logic/it-1-br-target4-1-1-1";

describe("営業担当者ごとの行動パターン分析レポート生成機能", () => {
  test("SCEN-476: 営業担当者の成約実績が複数件の場合、全件に基づいて成約率が計算される", () => {
    const sales_person_id = "A";
    const deal_records = [
      {
        sales_person_id: "A",
        deal_id: "001",
        customer_id: "cust_001",
        deal_amount: 1000000,
        deal_status: "closed_won",
        created_at: "2024-01-15T10:00:00Z",
      },
      {
        sales_person_id: "A",
        deal_id: "002",
        customer_id: "cust_002",
        deal_amount: 1500000,
        deal_status: "closed_won",
        created_at: "2024-01-16T11:00:00Z",
      },
      {
        sales_person_id: "A",
        deal_id: "003",
        customer_id: "cust_003",
        deal_amount: 2000000,
        deal_status: "closed_won",
        created_at: "2024-01-17T12:00:00Z",
      },
      {
        sales_person_id: "A",
        deal_id: "004",
        customer_id: "cust_004",
        deal_amount: 0,
        deal_status: "closed_lost",
        created_at: "2024-01-18T13:00:00Z",
      },
      {
        sales_person_id: "A",
        deal_id: "005",
        customer_id: "cust_005",
        deal_amount: 0,
        deal_status: "closed_lost",
        created_at: "2024-01-19T14:00:00Z",
      },
    ];

    const report = generateSalesPersonBehaviorAnalysisReport(
      sales_person_id,
      deal_records
    );

    const closed_won_count = 3;
    const total_deal_count = 5;
    const expected_win_rate = 60;

    expect(report.sales_person_id).toBe("A");
    expect(report.total_deal_count).toBe(total_deal_count);
    expect(report.closed_won_count).toBe(closed_won_count);
    expect(report.win_rate).toBe(expected_win_rate);
  });
});