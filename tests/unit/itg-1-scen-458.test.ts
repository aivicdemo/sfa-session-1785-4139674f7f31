import { monitorInferenceAccuracy } from "../../src/logic/it-1-br-2-1-1-1";

describe("AIエージェント推論精度の自動監視とアラート機能", () => {
  // SCEN-458
  test("推論精度がちょうど閾値の場合、アラートが発生する", () => {
    const threshold_percent = 80.0;
    const agent_id = "agent_001";
    const inference_accuracy = 80.0;
    const check_timestamp = new Date("2024-01-15T10:30:00Z");

    const result = monitorInferenceAccuracy({
      agent_id,
      accuracy_percent: inference_accuracy,
      threshold_percent,
      check_timestamp,
    });

    expect(result.alert_triggered).toBe(true);
    expect(result.alert_type).toBe("精度閾値到達");
    expect(result.severity).toBe("警告");
    expect(result.alert_timestamp).toEqual(check_timestamp);
    expect(result.agent_id).toBe(agent_id);
    expect(result.dashboard_updated).toBe(true);
    expect(result.accuracy_value).toBe(80.0);
  });
});