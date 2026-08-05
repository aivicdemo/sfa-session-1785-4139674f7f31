import { describe, test, expect, beforeEach, afterEach } from "@jest/globals";
import { generateSalesBehaviorPatternReport } from "../../src/logic/it-1-br-2-1-1-1";

describe("AIエージェント推論精度の自動監視とアラート機能", () => {
  // SCEN-584: [edge] 営業担当者の行動パターン分析レポート生成機能 - 分析対象期間が前月末から当月初にまたがる場合
  test("分析対象期間が前月末から当月初にまたがる場合、営業行動データを正確に集計する", () => {
    const start_date = new Date("2024-01-31T00:00:00Z");
    const end_date = new Date("2024-02-01T23:59:59Z");
    const sales_rep_id = "SR001";

    const mock_behavior_data = [
      {
        date: "2024-01-31",
        sales_rep_id: sales_rep_id,
        visit_count: 2,
        proposal_count: 1,
        order_count: 1,
      },
      {
        date: "2024-02-01",
        sales_rep_id: sales_rep_id,
        visit_count: 3,
        proposal_count: 2,
        order_count: 0,
      },
    ];

    const report = generateSalesBehaviorPatternReport({
      start_date: start_date,
      end_date: end_date,
      sales_rep_id: sales_rep_id,
      behavior_data: mock_behavior_data,
    });

    expect(report).toBeDefined();
    expect(report.analysis_period_start).toEqual("2024-01-31");
    expect(report.analysis_period_end).toEqual("2024-02-01");
    expect(report.sales_rep_id).toBe(sales_rep_id);
    expect(report.total_days).toBe(2);
    expect(report.total_visit_count).toBe(5);
    expect(report.total_proposal_count).toBe(3);
    expect(report.total_order_count).toBe(1);
    expect(report.daily_records).toHaveLength(2);
    expect(report.daily_records[0]).toEqual({
      date: "2024-01-31",
      visit_count: 2,
      proposal_count: 1,
      order_count: 1,
    });
    expect(report.daily_records[1]).toEqual({
      date: "2024-02-01",
      visit_count: 3,
      proposal_count: 2,
      order_count: 0,
    });
    expect(report.average_daily_visit_rate).toBe(2.5);
    expect(report.average_daily_proposal_rate).toBe(1.5);
    expect(report.overall_order_conversion_rate).toBe(0.3333333333333333);
  });
});