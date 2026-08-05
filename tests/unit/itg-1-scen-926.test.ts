import { monitorInferenceAccuracy } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-926
  test('推論精度が監視閾値直上のときアラートが発生する判定となる', () => {
    const monitoring_threshold_percent = 75.0;
    const inference_accuracy_percent = 75.0;
    const expected_alert_should_trigger = true;
    const expected_alert_level = 'WARNING';
    const expected_alert_message = '推論精度が監視閾値(75.0%)に達しました';

    const result = monitorInferenceAccuracy({
      monitoring_threshold: monitoring_threshold_percent,
      inference_accuracy: inference_accuracy_percent,
    });

    expect(result.should_alert).toBe(expected_alert_should_trigger);
    expect(result.alert_level).toBe(expected_alert_level);
    expect(result.alert_message).toBe(expected_alert_message);
  });
});