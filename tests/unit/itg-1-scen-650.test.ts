import { monitorAiInferenceAccuracy } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-650
  test('推論精度がちょうど監視閾値（95%）のとき、正常範囲内として記録される', () => {
    const threshold_percent = 95;
    const measured_accuracy_percent = 95;
    const measurement_timestamp = new Date('2024-01-15T10:00:00Z');
    const agent_id = 'agent_001';

    const result = monitorAiInferenceAccuracy({
      threshold_percent,
      measured_accuracy_percent,
      measurement_timestamp,
      agent_id,
    });

    expect(result.recorded_accuracy_percent).toBe(95);
    expect(result.status).toBe('正常範囲内');
    expect(result.alert_triggered).toBe(false);
    expect(result.monitoring_log_entry).toEqual(
      expect.objectContaining({
        accuracy_percent: 95,
        threshold_percent: 95,
        status: '正常範囲内',
        agent_id: 'agent_001',
        measurement_timestamp: measurement_timestamp,
      })
    );
    expect(result.alert_history_entry_exists).toBe(false);
  });
});