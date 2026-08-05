import { evaluateInferenceAccuracy } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-514
  test('推論精度が閾値95%を超過した95.01%の場合にアラートが発生しない', () => {
    const threshold_percent = 95;
    const current_accuracy_percent = 95.01;
    const alert_history_log_before: Array<{ timestamp: string; alert_triggered: boolean; accuracy_percent: number }> = [];

    const result = evaluateInferenceAccuracy({
      threshold_percent,
      current_accuracy_percent,
      alert_history_log: alert_history_log_before,
    });

    expect(result.should_alert).toBe(false);
    expect(result.alert_history_log).toEqual(alert_history_log_before);
    expect(result.alert_history_log.length).toBe(0);
    expect(result.exceeds_threshold).toBe(true);
    expect(result.final_accuracy_percent).toBe(95.01);
  });
});