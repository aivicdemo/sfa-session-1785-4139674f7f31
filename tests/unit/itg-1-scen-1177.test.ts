import { generateBehaviorPatternReports } from "../../src/logic/it-1-br-target4-1-1-1";

describe("行動パターン分析レポート生成機能", () => {
  // SCEN-1177
  test("複数の営業担当者のレポートが個別に生成される", () => {
    const targetDate = new Date("2024-01-15T00:00:00Z");
    const thirtyDaysAgo = new Date("2024-12-16T00:00:00Z");

    const sales_rep_a = {
      sales_rep_id: "sr_001",
      sales_rep_name: "営業担当者A",
      visit_count: 15,
      call_count: 28,
      proposal_count: 8,
      follow_up_count: 12,
      analysis_start_date: thirtyDaysAgo,
      analysis_end_date: targetDate,
    };

    const sales_rep_b = {
      sales_rep_id: "sr_002",
      sales_rep_name: "営業担当者B",
      visit_count: 22,
      call_count: 35,
      proposal_count: 11,
      follow_up_count: 18,
      analysis_start_date: thirtyDaysAgo,
      analysis_end_date: targetDate,
    };

    const sales_rep_c = {
      sales_rep_id: "sr_003",
      sales_rep_name: "営業担当者C",
      visit_count: 18,
      call_count: 31,
      proposal_count: 9,
      follow_up_count: 14,
      analysis_start_date: thirtyDaysAgo,
      analysis_end_date: targetDate,
    };

    const request_input = {
      sales_reps: [sales_rep_a, sales_rep_b, sales_rep_c],
      report_generation_datetime: new Date("2024-01-15T11:30:00Z"),
    };

    const result = generateBehaviorPatternReports(request_input);

    expect(result.reports).toHaveLength(3);

    const report_a = result.reports.find(
      (r) => r.sales_rep_id === "sr_001"
    );
    expect(report_a).toBeDefined();
    expect(report_a!.report_id).toBeDefined();
    expect(report_a!.sales_rep_name).toBe("営業担当者A");
    expect(report_a!.generated_datetime).toEqual(
      new Date("2024-01-15T11:30:00Z")
    );
    expect(report_a!.visit_count).toBe(15);
    expect(report_a!.call_count).toBe(28);
    expect(report_a!.proposal_count).toBe(8);
    expect(report_a!.follow_up_count).toBe(12);
    expect(report_a!.analysis_period_start).toEqual(thirtyDaysAgo);
    expect(report_a!.analysis_period_end).toEqual(targetDate);

    const report_b = result.reports.find(
      (r) => r.sales_rep_id === "sr_002"
    );
    expect(report_b).toBeDefined();
    expect(report_b!.report_id).toBeDefined();
    expect(report_b!.sales_rep_name).toBe("営業担当者B");
    expect(report_b!.generated_datetime).toEqual(
      new Date("2024-01-15T11:30:00Z")
    );
    expect(report_b!.visit_count).toBe(22);
    expect(report_b!.call_count).toBe(35);
    expect(report_b!.proposal_count).toBe(11);
    expect(report_b!.follow_up_count).toBe(18);
    expect(report_b!.analysis_period_start).toEqual(thirtyDaysAgo);
    expect(report_b!.analysis_period_end).toEqual(targetDate);

    const report_c = result.reports.find(
      (r) => r.sales_rep_id === "sr_003"
    );
    expect(report_c).toBeDefined();
    expect(report_c!.report_id).toBeDefined();
    expect(report_c!.sales_rep_name).toBe("営業担当者C");
    expect(report_c!.generated_datetime).toEqual(
      new Date("2024-01-15T11:30:00Z")
    );
    expect(report_c!.visit_count).toBe(18);
    expect(report_c!.call_count).toBe(31);
    expect(report_c!.proposal_count).toBe(9);
    expect(report_c!.follow_up_count).toBe(14);
    expect(report_c!.analysis_period_start).toEqual(thirtyDaysAgo);
    expect(report_c!.analysis_period_end).toEqual(targetDate);

    expect(report_a!.report_id).not.toBe(report_b!.report_id);
    expect(report_b!.report_id).not.toBe(report_c!.report_id);
    expect(report_a!.report_id).not.toBe(report_c!.report_id);

    expect(report_a!.sales_rep_id).not.toBe(report_b!.sales_rep_id);
    expect(report_b!.sales_rep_id).not.toBe(report_c!.sales_rep_id);
    expect(report_a!.sales_rep_id).not.toBe(report_c!.sales_rep_id);
  });
});