import { analyzeSelectionCriteria } from "../../src/logic/it-1-br-2-1-1";

describe("行動パターン分析指標自動選定機能", () => {
  // SCEN-1069
  test("分析対象期間の終了日が未指定の場合にエラーが発生する", () => {
    const analysisInput = {
      startDate: "2024-01-01",
      endDate: "",
      targetSalesPersonIds: ["SP001", "SP002"],
      analysisMetrics: ["contactFrequency", "proposalSuccessRate"],
    };

    expect(() => analyzeSelectionCriteria(analysisInput)).toThrow(/終了日/);
  });
});