import { generateSalesActivityPatternReport } from "../../src/logic/it-1-br-target4-1-1-1";

describe("営業担当者ごとの行動パターン分析レポート生成機能", () => {
  // SCEN-1160
  test("[edge] 業務上の最大規模データ量（1000件以上の営業活動ログ）で分析されるとき正確に処理される", async () => {
    const sales_person_id = "SP-001";
    const analysis_start_date = "2024-01-01";
    const analysis_end_date = "2024-01-31";

    const mock_activity_logs: Array<{
      activity_id: string;
      sales_person_id: string;
      activity_date: string;
      activity_type: string;
      customer_id: string;
      contract_amount: number;
      is_contract: boolean;
    }> = [];

    for (let i = 0; i < 1000; i++) {
      const day = String((i % 31) + 1).padStart(2, "0");
      const activity_types = ["visit", "phone_call", "email"];
      const activity_type_index = i % 3;
      const is_contract_flag = i % 10 === 0;
      const contract_amount = is_contract_flag ? 100000 + i * 100 : 0;

      mock_activity_logs.push({
        activity_id: `ACT-${String(i + 1).padStart(5, "0")}`,
        sales_person_id: sales_person_id,
        activity_date: `2024-01-${day}`,
        activity_type: activity_types[activity_type_index],
        customer_id: `CUST-${String((i % 50) + 1).padStart(3, "0")}`,
        contract_amount: contract_amount,
        is_contract: is_contract_flag,
      });
    }

    const expected_total_activities = 1000;
    const expected_visit_count = Math.floor(1000 / 3);
    const expected_phone_count = Math.floor(1000 / 3);
    const expected_email_count = 1000 - expected_visit_count - expected_phone_count;
    const expected_contract_count = 100;
    const expected_contract_rate = (100 / 1000) * 100;
    const expected_total_contract_amount = 100 * 100000 + (0 + 99) * (100 / 2) * 100;
    const expected_avg_contract_amount =
      expected_total_contract_amount / expected_contract_count;

    const start_time = process.hrtime.bigint();
    const report = await generateSalesActivityPatternReport({
      sales_person_id: sales_person_id,
      analysis_start_date: analysis_start_date,
      analysis_end_date: analysis_end_date,
      activity_logs: mock_activity_logs,
    });
    const end_time = process.hrtime.bigint();

    const elapsed_milliseconds = Number(
      (end_time - start_time) / BigInt(1000000)
    );

    expect(report).toBeDefined();
    expect(report).toHaveProperty("sales_person_id");
    expect(report).toHaveProperty("analysis_period");
    expect(report).toHaveProperty("activity_pattern_summary");
    expect(report).toHaveProperty("contract_metrics");
    expect(report).toHaveProperty("generated_at");

    expect(report.sales_person_id).toBe(sales_person_id);

    expect(report.activity_pattern_summary).toBeDefined();
    expect(report.activity_pattern_summary.total_activities).toBe(
      expected_total_activities
    );

    expect(report.activity_pattern_summary.visit_count).toBe(
      expected_visit_count
    );
    expect(report.activity_pattern_summary.phone_count).toBe(expected_phone_count);
    expect(report.activity_pattern_summary.email_count).toBe(expected_email_count);

    expect(report.contract_metrics).toBeDefined();
    expect(report.contract_metrics.total_contracts).toBe(expected_contract_count);
    expect(report.contract_metrics.contract_rate).toBeCloseTo(
      expected_contract_rate,
      2
    );
    expect(report.contract_metrics.average_contract_amount).toBeCloseTo(
      expected_avg_contract_amount,
      2
    );

    expect(elapsed_milliseconds).toBeLessThan(60000);

    expect(typeof report).toBe("object");
    expect(JSON.stringify(report)).toBeTruthy();
  });
});