import { calculateProcessDeviationImpact } from "../../src/logic/it-1-br-2-1-1-1";

describe("AIエージェント推論精度の自動監視とアラート機能", () => {
  test("SCEN-1197: プロセス乖離影響度計算機能 - 標準プロセスからの乖離度が負の値のときエラーになる", () => {
    // SCEN-1197
    const inputData = {
      processName: "初回接触",
      deviationScore: -15.5,
      analysisStartDate: "2024-01-01",
      analysisEndDate: "2024-01-31",
      targetSalesReps: ["REP001"],
    };

    expect(() => calculateProcessDeviationImpact(inputData)).toThrow(/乖離度/);
  });
});