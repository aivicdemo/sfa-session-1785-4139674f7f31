import { calculateAiInferenceAccuracyAlert } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-324
  test('推論精度が監視基準内である場合にアラートが発生しない', () => {
    const monitoring_threshold_accuracy = 90;
    const actual_inference_accuracy = 92;
    const inference_id = 'inf_2024_001';
    const inference_timestamp = new Date('2024-01-15T11:00:00Z');
    const model_version = 'v1.2.3';

    const result = calculateAiInferenceAccuracyAlert({
      inference_id,
      inference_timestamp,
      actual_accuracy: actual_inference_accuracy,
      monitoring_threshold: monitoring_threshold_accuracy,
      model_version,
    });

    expect(result.should_alert).toBe(false);
    expect(result.alert_count).toBe(0);
    expect(result.accuracy_deviation).toBe(2);
    expect(result.status).toBe('normal');
  });
});