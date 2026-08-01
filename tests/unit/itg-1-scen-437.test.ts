import { evaluateInferenceAccuracy } from "../../src/logic/it-1-br-2-1-1-1";

describe("AIエージェント推論精度の自動監視とアラート機能", () => {
  test("SCEN-437: 推論精度が0.0の場合、正確に評価される", () => {
    // Arrange
    const inferenceAccuracyScore = 0.0;
    const accuracyThreshold = 0.5;
    const expectedSeverity = "Critical";
    const expectedAccuracyValue = 0.0;
    const expectedAlertMessage = "AIエージェント推論精度が閾値0.5以下に低下しました。現在値：0.0";

    // Act
    const result = evaluateInferenceAccuracy({
      accuracyScore: inferenceAccuracyScore,
      threshold: accuracyThreshold,
    });

    // Assert
    expect(result.recordedAccuracy).toBe(expectedAccuracyValue);
    expect(result.severity).toBe(expectedSeverity);
    expect(result.isAlertGenerated).toBe(true);
    expect(result.alertMessage).toBe(expectedAlertMessage);
    expect(result.alertThresholdExceeded).toBe(true);
  });
});