import { calculateAiInferenceAccuracyMonitoringAlert } from "../../src/logic/it-1-br-2-1-1-1";

describe("AIエージェント推論精度の自動監視とアラート機能", () => {
  // SCEN-1163
  test("推論精度が監視閾値直上のとき正常と判定される", () => {
    const threshold_percentage = 85.0;
    const current_accuracy_percentage = 85.1;

    const result = calculateAiInferenceAccuracyMonitoringAlert({
      threshold_percentage,
      current_accuracy_percentage,
    });

    expect(result.is_alert_triggered).toBe(false);
    expect(result.status).toBe("正常");
    expect(result.current_accuracy_percentage).toBe(85.1);
    expect(result.threshold_percentage).toBe(85.0);
    expect(result.log_message).toMatch(/85\.1%/);
    expect(result.log_message).toMatch(/85\.0%/);
    expect(result.log_message).toMatch(/正常/);
  });
});