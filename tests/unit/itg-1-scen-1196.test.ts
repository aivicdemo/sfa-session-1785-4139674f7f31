import { describe, test, expect } from "@jest/globals";
import { calculateProcessDeviationImpact } from "../../src/logic/it-1-br-2-1-1-1";

describe("AIエージェント推論精度の自動監視とアラート機能", () => {
  // SCEN-1196
  test("プロセス乖離影響度計算機能 - 標準プロセスからの乖離度が null のとき処理がエラーになる", () => {
    const processId = "PROC-2024-001";
    const calculationPeriodStart = new Date("2024-01-01T00:00:00Z");
    const calculationPeriodEnd = new Date("2024-01-31T23:59:59Z");
    const processDeviationDegree = null;
    const contractedAmount = 500000;
    const successRateDeviation = 0.15;

    expect(() =>
      calculateProcessDeviationImpact({
        processId,
        calculationPeriodStart,
        calculationPeriodEnd,
        processDeviationDegree,
        contractedAmount,
        successRateDeviation,
      })
    ).toThrow(/乖離度/);
  });
});