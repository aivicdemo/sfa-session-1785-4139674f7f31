import { selectBehaviorPatternAnalysisIndicators } from "../../src/logic/it-1-br-2-1-1";

describe("行動パターン分析対象指標の自動選定", () => {
  // SCEN-786
  test("分析対象指標リストに重複する指標が含まれない", () => {
    const input_indicators = [
      { id: "ind_001", name: "訪問回数", category: "activity" },
      { id: "ind_002", name: "提案数", category: "proposal" },
      { id: "ind_003", name: "受注率", category: "result" },
      { id: "ind_001", name: "訪問回数", category: "activity" },
    ];

    const result = selectBehaviorPatternAnalysisIndicators(input_indicators);

    const unique_indicators = result.selected_indicators;
    expect(unique_indicators.length).toBe(3);

    const indicator_names = unique_indicators.map((ind) => ind.name);
    const unique_names = new Set(indicator_names);
    expect(unique_names.size).toBe(3);

    expect(indicator_names).toContain("訪問回数");
    expect(indicator_names).toContain("提案数");
    expect(indicator_names).toContain("受注率");

    const visit_count = indicator_names.filter(
      (name) => name === "訪問回数"
    ).length;
    const proposal_count = indicator_names.filter(
      (name) => name === "提案数"
    ).length;
    const contract_rate_count = indicator_names.filter(
      (name) => name === "受注率"
    ).length;

    expect(visit_count).toBe(1);
    expect(proposal_count).toBe(1);
    expect(contract_rate_count).toBe(1);
  });
});