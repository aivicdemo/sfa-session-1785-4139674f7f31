import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import { monitorAiAgentInferenceAccuracy } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-532
  test('推論精度がアラート設定の閾値以下の場合、アラートが生成される', () => {
    const alert_threshold_percent = 75;
    const current_accuracy_percent = 70;
    const alert_level = 'WARNING';
    const alert_message = 'AIエージェント推論精度が閾値以下です（現在値: 70%, 閾値: 75%）';
    const expected_alert_count = 1;

    const alert_settings = {
      accuracy_threshold_percent: alert_threshold_percent,
      is_enabled: true,
    };

    const inference_metrics = {
      accuracy_percent: current_accuracy_percent,
      measurement_timestamp: new Date('2024-01-15T11:00:00Z'),
    };

    const result = monitorAiAgentInferenceAccuracy(alert_settings, inference_metrics);

    expect(result.alerts).toHaveLength(expected_alert_count);
    expect(result.alerts[0].level).toBe(alert_level);
    expect(result.alerts[0].message).toBe(alert_message);
    expect(result.alerts[0].timestamp).toEqual(new Date('2024-01-15T11:00:00Z'));
    expect(result.accuracy_below_threshold).toBe(true);
  });
});