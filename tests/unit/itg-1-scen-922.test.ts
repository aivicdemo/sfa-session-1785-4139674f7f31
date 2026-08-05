import { calculateTeamQualityMetrics } from "../../src/logic/it-1-br-2-1-1";

describe("チーム営業品質月次分析機能", () => {
  // SCEN-922
  test("複数の営業担当者の成約率がチーム平均と同値のとき全員の乖離度が0%と判定される", () => {
    const salesRepresentatives = [
      {
        sales_rep_id: "rep_001",
        sales_rep_name: "営業担当者A",
        contract_rate: 65.0,
      },
      {
        sales_rep_id: "rep_002",
        sales_rep_name: "営業担当者B",
        contract_rate: 65.0,
      },
      {
        sales_rep_id: "rep_003",
        sales_rep_name: "営業担当者C",
        contract_rate: 65.0,
      },
    ];

    const result = calculateTeamQualityMetrics({
      sales_representatives: salesRepresentatives,
      analysis_period_start: "2024-01-01",
      analysis_period_end: "2024-01-31",
    });

    expect(result.team_average_contract_rate).toBe(65.0);

    expect(result.sales_rep_deviations).toHaveLength(3);

    expect(result.sales_rep_deviations[0]).toEqual({
      sales_rep_id: "rep_001",
      sales_rep_name: "営業担当者A",
      contract_rate: 65.0,
      deviation_percentage: 0.0,
    });

    expect(result.sales_rep_deviations[1]).toEqual({
      sales_rep_id: "rep_002",
      sales_rep_name: "営業担当者B",
      contract_rate: 65.0,
      deviation_percentage: 0.0,
    });

    expect(result.sales_rep_deviations[2]).toEqual({
      sales_rep_id: "rep_003",
      sales_rep_name: "営業担当者C",
      contract_rate: 65.0,
      deviation_percentage: 0.0,
    });
  });
});