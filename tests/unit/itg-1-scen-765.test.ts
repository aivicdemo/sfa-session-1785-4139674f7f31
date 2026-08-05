import { calculateInferenceAccuracyScore } from "../../src/logic/it-1-br-2-1-1-1";

describe("AIエージェント推論精度の自動監視とアラート機能", () => {
  // SCEN-765: [edge] AIエージェント推論精度評価機能 - 推論精度計算で端数が生じる場合（例：33.333%）、適切に丸められてスコア算出される
  test("推論精度計算で端数が生じる場合、小数点以下第2位で四捨五入されてスコア値が算出される", () => {
    // Arrange
    const totalInferenceCount = 3;
    const correctCount = 1;
    const expectedAccuracyScore = 33.33;
    const expectedAccuracyLevel = "MEDIUM";

    // Act
    const result = calculateInferenceAccuracyScore({
      totalInferenceCount,
      correctCount,
    });

    // Assert
    expect(result.accuracyScore).toBe(expectedAccuracyScore);
    expect(result.accuracyLevel).toBe(expectedAccuracyLevel);
    expect(typeof result.accuracyScore).toBe("number");
    expect(result.accuracyScore.toString().split(".")[1]?.length ?? 0).toBeLessThanOrEqual(
      2
    );
  });
});