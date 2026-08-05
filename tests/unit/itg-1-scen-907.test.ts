import { describe, test, expect } from "@jest/globals";
import { analyzeTeamQualityTrendMonthly } from "../../src/logic/it-1-br-2-1-1";

describe("チーム営業品質月次分析機能", () => {
  test("SCEN-907: 過去3ヶ月の成約率がチーム平均とちょうど同値のときの乖離度が0%と判定される", () => {
    // Arrange: スタブデータ設定
    const pastThreeMonthsData = [
      {
        month: "2024-09",
        sales_rep_id: "rep_001",
        contract_rate: 65,
      },
      {
        month: "2024-10",
        sales_rep_id: "rep_001",
        contract_rate: 70,
      },
      {
        month: "2024-11",
        sales_rep_id: "rep_001",
        contract_rate: 68,
      },
    ];

    const team_average_contract_rate = 67.67;
    const current_month = "2024-11";
    const sales_rep_id = "rep_001";

    // Act: 月次分析処理を実行
    const result = analyzeTeamQualityTrendMonthly({
      past_three_months_data: pastThreeMonthsData,
      team_average_contract_rate: team_average_contract_rate,
      current_month: current_month,
      sales_rep_id: sales_rep_id,
    });

    // Assert: 計算結果が(68% - 67.67%) / 67.67% × 100 = 0.487%≈0%（許容誤差±0.01%以内）
    // 実際の計算: (68 - 67.67) / 67.67 * 100 = 0.33 / 67.67 * 100 = 0.00487... ≈ 0%
    const expected_deviation = 0.0;
    const tolerance = 0.01;

    expect(result.deviation_percentage).toBeLessThanOrEqual(
      expected_deviation + tolerance
    );
    expect(result.deviation_percentage).toBeGreaterThanOrEqual(
      expected_deviation - tolerance
    );
    expect(result.deviation_percentage).toBeCloseTo(0, 2);
  });
});