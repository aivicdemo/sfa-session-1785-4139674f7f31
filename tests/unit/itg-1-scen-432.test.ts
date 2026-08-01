import { evaluateAlertSettings } from "../../src/logic/it-1-br-2-1-1-1";

describe("AIエージェント推論精度の自動監視とアラート機能", () => {
  // SCEN-432
  test("複数のアラート設定が存在する場合、全ての設定に基づいてアラートが判定される", () => {
    const inference_accuracy = 82;
    const inference_count = 120;

    const alert_settings = [
      {
        alert_setting_id: "ALERT_001",
        alert_condition_type: "inference_accuracy_threshold",
        threshold_value: 80,
        operator: "less_than",
      },
      {
        alert_setting_id: "ALERT_002",
        alert_condition_type: "inference_accuracy_and_count",
        threshold_accuracy: 85,
        threshold_count: 100,
        operator: "and",
      },
      {
        alert_setting_id: "ALERT_003",
        alert_condition_type: "inference_accuracy_threshold",
        threshold_value: 90,
        operator: "less_than",
      },
    ];

    const result = evaluateAlertSettings({
      inference_accuracy,
      inference_count,
      alert_settings,
    });

    expect(result.evaluation_results).toHaveLength(3);

    expect(result.evaluation_results[0]).toEqual({
      alert_setting_id: "ALERT_001",
      condition_type: "inference_accuracy_threshold",
      is_triggered: false,
      evaluation_logic:
        "82 < 80 = false (accuracy below 80% threshold not met)",
    });

    expect(result.evaluation_results[1]).toEqual({
      alert_setting_id: "ALERT_002",
      condition_type: "inference_accuracy_and_count",
      is_triggered: true,
      evaluation_logic:
        "82 < 85 AND 120 >= 100 = true (accuracy below 85% AND count meets threshold)",
    });

    expect(result.evaluation_results[2]).toEqual({
      alert_setting_id: "ALERT_003",
      condition_type: "inference_accuracy_threshold",
      is_triggered: true,
      evaluation_logic:
        "82 < 90 = true (accuracy below 90% threshold met)",
    });

    expect(result.triggered_alerts).toEqual(["ALERT_002", "ALERT_003"]);
    expect(result.triggered_alerts).toHaveLength(2);
  });
});