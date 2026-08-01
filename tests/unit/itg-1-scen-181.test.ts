import { analyzeOperationalPatternAndDetermineSalesScoreRiskLevel } from "../../src/logic/it-1-br-2-1-1-1";

describe("AIエージェント推論精度の自動監視とアラート機能", () => {
  // SCEN-181
  test("成約率がちょうど50%の場合、中位リスク指標として判定される", () => {
    const salesPersonData = {
      salesPersonId: "SP-001",
      dealClosureRate: 0.5,
      processComplianceScore: 75,
      followUpFrequencyPerDay: 2.5,
      proposalAccuracyScore: 80,
    };

    const result = analyzeOperationalPatternAndDetermineSalesScoreRiskLevel(
      salesPersonData
    );

    expect(result.riskLevel).toBe("中位リスク");
    expect(result.improvementTargetClassCode).toBe("MEDIUM_RISK");
  });
});