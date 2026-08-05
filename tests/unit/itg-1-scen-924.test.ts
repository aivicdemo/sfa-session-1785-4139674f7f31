import { monitorAiInferenceAccuracy } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度監視機能 - 閾値境界判定', () => {
  // SCEN-924
  test('推論精度がちょうど監視閾値のときにアラート判定が閾値境界で確定される', () => {
    const monitoring_threshold_percent = 80.0;

    // ケース1: 推論精度がちょうど80.0%の場合
    const inference_accuracy_at_threshold = 80.0;
    const result_at_threshold = monitorAiInferenceAccuracy({
      inference_accuracy_percent: inference_accuracy_at_threshold,
      threshold_percent: monitoring_threshold_percent,
    });
    expect(result_at_threshold.should_alert).toBe(true);
    expect(result_at_threshold.alert_reason).toMatch(/精度.*閾値以下/);

    // ケース2: 推論精度が79.9%の場合（閾値未満）
    const inference_accuracy_below_threshold = 79.9;
    const result_below_threshold = monitorAiInferenceAccuracy({
      inference_accuracy_percent: inference_accuracy_below_threshold,
      threshold_percent: monitoring_threshold_percent,
    });
    expect(result_below_threshold.should_alert).toBe(true);
    expect(result_below_threshold.alert_reason).toMatch(/精度.*閾値以下/);

    // ケース3: 推論精度が80.1%の場合（閾値超過）
    const inference_accuracy_above_threshold = 80.1;
    const result_above_threshold = monitorAiInferenceAccuracy({
      inference_accuracy_percent: inference_accuracy_above_threshold,
      threshold_percent: monitoring_threshold_percent,
    });
    expect(result_above_threshold.should_alert).toBe(false);

    // 閾値80.0%の判定境界を確認：精度 ≤ 80.0% でアラート発生
    expect(result_at_threshold.should_alert).toBe(true);
    expect(result_below_threshold.should_alert).toBe(true);
    expect(result_above_threshold.should_alert).toBe(false);
  });
});