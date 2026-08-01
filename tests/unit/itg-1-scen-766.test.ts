import { selectAnalysisIndicators } from "../../src/logic/it-1-br-2-1-1";

describe("営業担当者の行動パターン分析対象指標の自動選定", () => {
  test("SCEN-766: 同じ優先度の複数指標がアルファベット順でソートされる", () => {
    const indicatorsInput = [
      { name: "SalesVelocity", priority: 5 },
      { name: "ConversionRate", priority: 5 },
      { name: "ActivityCount", priority: 5 },
      { name: "BehaviorScore", priority: 5 },
    ];

    const result = selectAnalysisIndicators(indicatorsInput);

    expect(result).toEqual([
      { name: "ActivityCount", priority: 5 },
      { name: "BehaviorScore", priority: 5 },
      { name: "ConversionRate", priority: 5 },
      { name: "SalesVelocity", priority: 5 },
    ]);
  });
});