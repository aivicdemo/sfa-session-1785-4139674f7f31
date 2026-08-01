import { selectAnalysisIndicators } from "../../src/logic/it-1-br-2-1-1";

describe("行動パターン分析対象指標の自動選定", () => {
  // SCEN-769
  test("分析対象指標が複数件の場合、すべての指標を含むリストが返される", () => {
    const input_indicators = [
      {
        indicator_id: "IND-001",
        indicator_name: "売上金額",
        indicator_type: "revenue",
      },
      {
        indicator_id: "IND-002",
        indicator_name: "訪問回数",
        indicator_type: "visit_count",
      },
      {
        indicator_id: "IND-003",
        indicator_name: "成約率",
        indicator_type: "conversion_rate",
      },
    ];

    const result = selectAnalysisIndicators(input_indicators);

    expect(result).toHaveLength(3);

    expect(result[0]).toEqual({
      indicator_id: "IND-001",
      indicator_name: "売上金額",
      indicator_type: "revenue",
    });

    expect(result[1]).toEqual({
      indicator_id: "IND-002",
      indicator_name: "訪問回数",
      indicator_type: "visit_count",
    });

    expect(result[2]).toEqual({
      indicator_id: "IND-003",
      indicator_name: "成約率",
      indicator_type: "conversion_rate",
    });

    const result_ids = result.map((ind) => ind.indicator_id);
    expect(result_ids).toEqual(["IND-001", "IND-002", "IND-003"]);
  });
});