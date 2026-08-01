import { checkSystemHealth } from "../../src/logic/it-1-br-2-1-1-1";

describe("AIエージェント推論精度の自動監視とアラート機能", () => {
  // SCEN-217
  test("should output PASS status with 100.0 score when data quality exactly meets pass criteria", () => {
    const input = {
      dataCompleteness: 95.0,
      duplicationRate: 2.0,
      dataQualityScore: 95.0,
      aiInferenceAccuracy: 95.0,
      systemUptimePercent: 99.9,
    };

    const result = checkSystemHealth(input);

    expect(result.status).toBe("PASS");
    expect(result.totalScore).toBe(100.0);
    expect(result.judgment).toBe("合格");
  });
});