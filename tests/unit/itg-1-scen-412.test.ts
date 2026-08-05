import { analyzeSuccessPatternApplicability } from "../../src/logic/it-1-br-2-1-1";

describe("成功パターン適用判定機能 - 年度をまたぐ参照期間での実績集計", () => {
  // SCEN-412
  test("年度をまたぐ参照期間で前年度と当年度の実績データが正確に統合されること", () => {
    const start_date_str = "2024-01-01";
    const end_date_str = "2025-03-31";

    const prior_year_results = {
      period_start: "2024-01-01",
      period_end: "2024-12-31",
      revenue_millions: 15.0,
      achievement_count: 45,
    };

    const current_year_results = {
      period_start: "2025-01-01",
      period_end: "2025-03-31",
      revenue_millions: 8.0,
      achievement_count: 28,
    };

    const result = analyzeSuccessPatternApplicability({
      reference_period_start: start_date_str,
      reference_period_end: end_date_str,
      historical_results: [prior_year_results, current_year_results],
    });

    expect(result.aggregated_period_start).toBe("2024-01-01");
    expect(result.aggregated_period_end).toBe("2025-03-31");
    expect(result.aggregated_revenue_millions).toBe(23.0);
    expect(result.aggregated_achievement_count).toBe(73);
  });
});