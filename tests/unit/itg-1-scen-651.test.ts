import { monitorInferenceAccuracy } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-651
  test('推論精度が監視閾値直下（94.9%）のとき、アラートが発生する', () => {
    const monitoring_threshold_percent = 95;
    const current_inference_accuracy_percent = 94.9;
    const alert_level = 'warning';
    const expected_alert_message = `推論精度が監視閾値を下回りました。現在精度：${current_inference_accuracy_percent}%、閾値：${monitoring_threshold_percent}%`;

    const result = monitorInferenceAccuracy({
      monitoring_threshold_percent,
      current_inference_accuracy_percent,
    });

    expect(result).toEqual({
      alert_generated: true,
      alert_level,
      alert_message: expected_alert_message,
      threshold_percent: monitoring_threshold_percent,
      accuracy_percent: current_inference_accuracy_percent,
    });
  });
});