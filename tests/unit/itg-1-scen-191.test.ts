import { calculateCorrelationAndDetermineCoachingTarget } from "../../src/logic/it-1-br-2-1-1-1";

describe("AIエージェント推論精度の自動監視とアラート機能", () => {
  // SCEN-191
  test("営業担当者行動パターン分析・改善指導対象判定機能 - 乖離度と成約実績の相関係数が0未満の場合、負の相関として判定される", () => {
    const deviationAndResultsDataSet = [
      { deviation: 15.5, contractAmount: 1200000 },
      { deviation: 22.3, contractAmount: 950000 },
      { deviation: 18.7, contractAmount: 1050000 },
      { deviation: 25.1, contractAmount: 850000 },
      { deviation: 12.2, contractAmount: 1350000 },
    ];

    const result = calculateCorrelationAndDetermineCoachingTarget(
      deviationAndResultsDataSet,
      -0.45
    );

    expect(result.correlationCoefficient).toBe(-0.45);
    expect(result.correlationType).toBe("negative");
    expect(result.isCoachingTargetRequired).toBe(true);
  });
});