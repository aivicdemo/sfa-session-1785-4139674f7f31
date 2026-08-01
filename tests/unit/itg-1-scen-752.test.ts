import { selectAnalysisTargetMetrics } from "../../src/logic/it-1-br-target4-1-1-1";

describe("行動パターン分析対象指標の自動選定機能", () => {
  // SCEN-752
  test("フォローアップ間隔がプロセス標準書に定義されている場合、分析対象指標に含まれる", () => {
    const process_standard_definition = {
      follow_up_interval_days: 7,
      initial_contact_frequency_target: 1,
      proposal_success_rate_target: 0.5,
      negotiation_duration_days_max: 30,
    };

    const result = selectAnalysisTargetMetrics(
      process_standard_definition
    );

    expect(result).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          metric_name: "フォローアップ間隔",
          metric_value: 7,
          metric_unit: "日",
        }),
      ])
    );
    expect(
      result.find((m) => m.metric_name === "フォローアップ間隔")
    ).toBeDefined();
  });
});