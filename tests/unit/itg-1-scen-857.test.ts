import {
  analyzeProcessDeviationAndCorrelation,
} from "../../src/logic/it-1-br-target4-1-1-1";

describe("営業担当者ごとの行動パターン分析レポート生成機能", () => {
  // SCEN-857
  test("プロセス乖離率と成約実績の相関分析で負の相関が正しく記録される", () => {
    const salesReps = [
      {
        rep_id: "A",
        process_deviation_rate: 0.3,
        monthly_deals_count: 8,
        monthly_deal_amount: 4800000,
      },
      {
        rep_id: "B",
        process_deviation_rate: 0.45,
        monthly_deals_count: 6,
        monthly_deal_amount: 3600000,
      },
      {
        rep_id: "C",
        process_deviation_rate: 0.55,
        monthly_deals_count: 4,
        monthly_deal_amount: 2400000,
      },
      {
        rep_id: "D",
        process_deviation_rate: 0.65,
        monthly_deals_count: 2,
        monthly_deal_amount: 1200000,
      },
      {
        rep_id: "E",
        process_deviation_rate: 0.75,
        monthly_deals_count: 1,
        monthly_deal_amount: 600000,
      },
    ];

    const analysisTimestamp = new Date("2024-01-15T11:00:00Z");

    const result = analyzeProcessDeviationAndCorrelation(
      salesReps,
      analysisTimestamp
    );

    expect(result.correlation_coefficient).toBeLessThan(0);
    expect(result.correlation_coefficient).toBeCloseTo(-0.99, 1);
    expect(result.correlation_type).toBe("negative_correlation");
    expect(result.analysis_timestamp).toEqual(analysisTimestamp);
    expect(result.report_text).toMatch(/プロセス乖離率が高いほど成約実績が低下/);
    expect(result.data_records_analyzed).toBe(5);
    expect(result.calculation_formula).toMatch(/ピアソン/);
  });
});