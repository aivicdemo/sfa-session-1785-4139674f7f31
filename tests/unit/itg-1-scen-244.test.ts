import { calculateImprovementGuidancePriority } from "../../src/logic/it-1-br-2-1-1-1";

describe("AIエージェント推論精度の自動監視とアラート機能", () => {
  // SCEN-244: [error] 改善指導優先順位決定機能 - 優先順位決定の重み係数が負数のときエラーになる
  test("should throw error when weight coefficient is negative", () => {
    const improvementItemId = "ITEM-001";
    const evaluationScore = 75;
    const weightCoefficient = -0.5;

    expect(() =>
      calculateImprovementGuidancePriority({
        improvementItemId,
        evaluationScore,
        weightCoefficient,
      })
    ).toThrow(/重み係数/);
  });
});