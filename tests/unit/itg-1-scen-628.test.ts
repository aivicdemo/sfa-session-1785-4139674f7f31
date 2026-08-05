import { monitorInferenceAccuracy } from "../../src/logic/it-1-br-2-1-1-1";

describe("AIエージェント推論精度の自動監視とアラート機能", () => {
  // SCEN-628
  test("推論精度の監視対象閾値が定義されていないときエラーになる", () => {
    const inferenceAccuracyData = {
      accuracy_score: 0.85,
      inference_id: "inf_001",
      timestamp: new Date("2024-01-15T11:00:00Z"),
    };

    const monitoringConfig = {
      threshold_lower: undefined,
      threshold_upper: undefined,
    };

    expect(() =>
      monitorInferenceAccuracy(inferenceAccuracyData, monitoringConfig)
    ).toThrow(/推論精度の監視閾値が定義されていません/);
  });
});