import { calculateInferenceAccuracyStatus } from "../../src/logic/it-1-br-2-1-1-1";

describe("AIエージェント推論精度の自動監視とアラート機能", () => {
  // SCEN-1161
  test("推論精度がちょうど監視閾値（85%）のとき正常と判定される", () => {
    const threshold_percent = 85;
    const measured_accuracy_percent = 85;

    const result = calculateInferenceAccuracyStatus({
      threshold_percent,
      measured_accuracy_percent,
    });

    expect(result.status).toBe("Normal");
    expect(result.alert_triggered).toBe(false);
    expect(result.should_notify).toBe(false);
  });
});