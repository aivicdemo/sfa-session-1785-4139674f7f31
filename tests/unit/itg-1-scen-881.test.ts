import { analyzeTeamSalesQualityMetrics } from "../../src/logic/it-1-br-2-1-1";

describe("チーム営業品質統計分析機能", () => {
  // SCEN-881
  test("チーム平均成約率が計算できない（分母となる営業担当者数が0）とき、エラーになる", () => {
    const team_metrics_input = {
      sales_reps_count: 0,
      total_contracts: 10,
      total_opportunities: 50,
      analysis_period_start: "2024-01-01T00:00:00Z",
      analysis_period_end: "2024-01-31T23:59:59Z",
    };

    expect(() => analyzeTeamSalesQualityMetrics(team_metrics_input)).toThrow(
      /営業担当者数が0/
    );
  });
});