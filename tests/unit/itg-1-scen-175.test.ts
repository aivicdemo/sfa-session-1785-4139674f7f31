import { analyzeAgentInferenceAccuracy } from "../../src/logic/it-1-br-2-1-1-1";

describe("AIエージェント推論精度の自動監視とアラート機能", () => {
  // SCEN-175
  test("乖離度がちょうど0%の場合、標準プロセス準拠として判定される", () => {
    const salesRepId = "SR-001";
    const analysisPeriodStart = new Date("2024-01-01T00:00:00Z");
    const analysisPeriodEnd = new Date("2024-01-31T23:59:59Z");
    const standardProcessId = "PROC-STD-001";

    const actualBehaviorPattern = {
      initialContactFrequency: 2,
      proposalSuccessRate: 0.8,
      followUpInterval: 5,
      contractRate: 0.6,
    };

    const standardProcessPattern = {
      initialContactFrequency: 2,
      proposalSuccessRate: 0.8,
      followUpInterval: 5,
      contractRate: 0.6,
    };

    const result = analyzeAgentInferenceAccuracy({
      salesRepId,
      analysisPeriodStart,
      analysisPeriodEnd,
      standardProcessId,
      actualBehaviorPattern,
      standardProcessPattern,
    });

    expect(result.status).toBe("標準プロセス準拠");
    expect(result.deviationPercentage).toBe(0);
    expect(result.improvementTargetFlag).toBe(false);
    expect(result.improvementTargetList).not.toContain(salesRepId);
  });
});