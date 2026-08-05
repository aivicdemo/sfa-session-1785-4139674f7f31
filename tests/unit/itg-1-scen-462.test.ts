import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import { monitorAiInferenceAccuracy } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-462
  test('推論精度がアラート設定の閾値を超過した場合、アラート履歴に正常に記録される', () => {
    const alert_threshold_percentage = 80;
    const current_inference_accuracy_percentage = 75;
    const execution_timestamp = new Date('2024-01-15T11:00:00Z');
    const alert_type = '精度低下';
    const alert_status = '未対応';

    const result = monitorAiInferenceAccuracy({
      alert_threshold_percentage,
      current_inference_accuracy_percentage,
      execution_timestamp,
    });

    expect(result).toEqual({
      alert_recorded: true,
      alert_history_record: {
        alert_type,
        fired_timestamp: execution_timestamp,
        inference_accuracy_percentage: current_inference_accuracy_percentage,
        threshold_percentage: alert_threshold_percentage,
        alert_status,
      },
    });
    expect(result.alert_history_record.inference_accuracy_percentage).toBe(75);
    expect(result.alert_history_record.threshold_percentage).toBe(80);
    expect(result.alert_history_record.alert_type).toBe('精度低下');
    expect(result.alert_history_record.alert_status).toBe('未対応');
  });
});