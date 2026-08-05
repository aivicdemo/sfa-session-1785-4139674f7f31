import { monitorInferenceAccuracy } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-094
  test('推論精度が閾値以下の場合にアラートが正常に生成される', () => {
    const agent_id = 'agent_001';
    const current_accuracy = 0.65;
    const accuracy_threshold = 0.70;
    const check_timestamp = new Date('2024-01-15T11:00:00Z');

    const alert = monitorInferenceAccuracy({
      agent_id,
      current_accuracy,
      accuracy_threshold,
      check_timestamp,
    });

    expect(alert).toBeDefined();
    expect(alert.alert_count).toBe(1);
    expect(alert.alert_level).toBe('WARNING');
    expect(alert.alert_type).toBe('InferenceAccuracyBelowThreshold');
    expect(alert.target_agent_id).toBe(agent_id);
    expect(alert.alert_timestamp).toEqual(check_timestamp);
    expect(alert.alert_message).toMatch(/Current accuracy: 65%/);
    expect(alert.alert_message).toMatch(/Threshold: 70%/);
  });
});