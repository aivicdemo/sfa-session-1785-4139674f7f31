import { monitorAIInferenceAccuracy } from "../../src/logic/it-1-br-2-1-1-1";

describe("AIエージェント推論精度の自動監視とアラート機能", () => {
  test("SCEN-438: 推論精度が1.0の場合、正確に評価される", () => {
    const inferenceAccuracy = 1.0;
    const monitoringLogId = "monitor_20240115_001";
    const timestamp = new Date("2024-01-15T11:00:00Z");

    const result = monitorAIInferenceAccuracy({
      inferenceAccuracy,
      monitoringLogId,
      timestamp,
    });

    expect(result.accuracyScore).toBe(1.0);
    expect(result.judgmentStatus).toBe("最適");
    expect(result.monitoringLog).toEqual(
      expect.stringContaining("推論精度1.0：正常範囲内")
    );
    expect(result.monitoringLogId).toBe(monitoringLogId);
    expect(result.timestamp).toEqual(timestamp);
  });
});