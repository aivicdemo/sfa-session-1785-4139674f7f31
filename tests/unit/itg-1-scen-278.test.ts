import { analyzeAndJudgeImprovement } from "../../src/logic/it-1-br-2-1-1-1";

describe("AIエージェント推論精度の自動監視とアラート機能", () => {
  test("SCEN-278: 成約実績が0以下のとき、処理が中断される", () => {
    // Arrange
    const invalidSalesResult = 0;
    const salesPersonId = "sales_001";
    const analysisperiodStart = "2024-01-01";
    const analysisPeriodEnd = "2024-01-31";
    const standardProcessAdherenceRate = 85;
    const proposalAccuracyScore = 75;

    // Act & Assert
    expect(() =>
      analyzeAndJudgeImprovement({
        salesPersonId,
        salesResult: invalidSalesResult,
        analysisperiodStart,
        analysisPeriodEnd,
        standardProcessAdherenceRate,
        proposalAccuracyScore,
      })
    ).toThrow(/INVALID_SALES_RESULT/);
  });
});