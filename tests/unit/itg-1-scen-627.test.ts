import { describe, test, expect } from "@jest/globals";
import { monitorAIInferenceAccuracy } from "../../src/logic/it-1-br-2-1-1-1";

describe("AIエージェント推論精度の自動監視とアラート機能", () => {
  // SCEN-627
  test("アラート設定が欠落しているときエラーになる", () => {
    const inferenceResult = {
      modelId: "model_001",
      timestamp: new Date("2024-01-15T11:00:00Z"),
      inferenceScore: 0.92,
      confidenceLevel: 0.88,
      inferenceTime: 245,
    };

    const alertConfig = null;

    const monitoringContext = {
      aiInferenceResult: inferenceResult,
      alertConfiguration: alertConfig,
      thresholdTarget: 0.95,
      monitoringEnabled: true,
    };

    expect(() => monitorAIInferenceAccuracy(monitoringContext)).toThrow(
      /アラート設定/
    );
  });
});