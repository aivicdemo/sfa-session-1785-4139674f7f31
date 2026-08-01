import { analyzeAndSelectIndicators } from "../../src/logic/it-1-br-2-1-1";

describe("行動パターン分析対象指標の自動選定機能", () => {
  // SCEN-761
  test("指定された分析期間内の成約実績のみが相関分析に使用される", () => {
    const analysis_period_start = new Date("2024-01-01T00:00:00Z");
    const analysis_period_end = new Date("2024-03-31T23:59:59Z");

    const contract_results = [
      {
        contract_date: new Date("2023-12-15T00:00:00Z"),
        contract_amount: 500000,
      },
      {
        contract_date: new Date("2024-01-20T00:00:00Z"),
        contract_amount: 1000000,
      },
      {
        contract_date: new Date("2024-02-10T00:00:00Z"),
        contract_amount: 800000,
      },
      {
        contract_date: new Date("2024-04-05T00:00:00Z"),
        contract_amount: 700000,
      },
    ];

    const result = analyzeAndSelectIndicators({
      analysis_period_start,
      analysis_period_end,
      contract_results,
    });

    expect(result.filtered_contract_results).toHaveLength(2);
    expect(result.filtered_contract_results[0]).toEqual({
      contract_date: new Date("2024-01-20T00:00:00Z"),
      contract_amount: 1000000,
    });
    expect(result.filtered_contract_results[1]).toEqual({
      contract_date: new Date("2024-02-10T00:00:00Z"),
      contract_amount: 800000,
    });
    expect(result.total_filtered_amount).toBe(1800000);
    expect(result.is_period_filter_applied).toBe(true);
  });
});