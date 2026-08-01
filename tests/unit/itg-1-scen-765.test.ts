import { selectAnalysisIndicators } from "../../src/logic/it-1-br-2-1-1";

describe("行動パターン分析対象指標の自動選定機能", () => {
  // SCEN-765
  test("指標の優先度が高い順に分析対象指標リストが並び替えられる", () => {
    const indicators = [
      {
        id: "indicator_a",
        name: "指標A",
        priority: 3,
        type: "初回接触頻度",
      },
      {
        id: "indicator_b",
        name: "指標B",
        priority: 1,
        type: "提案成功率",
      },
      {
        id: "indicator_c",
        name: "指標C",
        priority: 2,
        type: "フォローアップ間隔",
      },
    ];

    const result = selectAnalysisIndicators(indicators);

    expect(result).toEqual([
      {
        id: "indicator_b",
        name: "指標B",
        priority: 1,
        type: "提案成功率",
      },
      {
        id: "indicator_c",
        name: "指標C",
        priority: 2,
        type: "フォローアップ間隔",
      },
      {
        id: "indicator_a",
        name: "指標A",
        priority: 3,
        type: "初回接触頻度",
      },
    ]);
  });
});