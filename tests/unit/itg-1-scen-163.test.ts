import { generateSalesBehaviorAnalysisReport } from "../../src/logic/it-1-br-target4-1-1-1";

describe("営業担当者ごとの行動パターン分析レポート生成機能", () => {
  // SCEN-163
  test("商談記録の入力期間が月末から月初にまたがるとき、正常に計算される", () => {
    const sales_rep_id = "EMP001";
    const current_month = new Date("2024-01-28");
    const next_month = new Date("2024-02-02");
    const analysis_start_date = new Date("2024-01-25");
    const analysis_end_date = new Date("2024-02-05");

    const deal_records = [
      {
        deal_record_id: "DR001",
        sales_rep_id: sales_rep_id,
        input_date: current_month,
        deal_date: current_month,
        customer_id: "CUST001",
        deal_amount: 500000,
        deal_stage: "提案",
        deal_status: "進行中",
      },
      {
        deal_record_id: "DR002",
        sales_rep_id: sales_rep_id,
        input_date: next_month,
        deal_date: next_month,
        customer_id: "CUST002",
        deal_amount: 750000,
        deal_stage: "交渉",
        deal_status: "進行中",
      },
    ];

    const result = generateSalesBehaviorAnalysisReport({
      sales_rep_id: sales_rep_id,
      analysis_start_date: analysis_start_date,
      analysis_end_date: analysis_end_date,
      deal_records: deal_records,
    });

    expect(result.sales_rep_id).toBe(sales_rep_id);
    expect(result.analysis_period_start).toEqual(analysis_start_date);
    expect(result.analysis_period_end).toEqual(analysis_end_date);
    expect(result.deal_count_in_period).toBe(2);
    expect(result.active_days_in_period).toBe(2);
    expect(result.aggregated_deal_records).toHaveLength(2);
    expect(result.aggregated_deal_records[0].deal_record_id).toBe("DR001");
    expect(result.aggregated_deal_records[1].deal_record_id).toBe("DR002");
  });
});