import { monitorInferenceAccuracy } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-466
  test('推論精度が0%の場合、最も低い精度として扱われアラートが発生する', () => {
    const inference_id = 'inf_20240115_001';
    const agent_id = 'agent_ai_sales_001';
    const accuracy_percent = 0;
    const accuracy_rank = '最低（0%）';
    const alert_type = '推論精度低下';
    const alert_severity = '高';
    const alert_message = 'AIエージェント推論精度が0%に低下しています。即座の調査が必要です。';
    const timestamp = new Date('2024-01-15T11:00:00Z');

    const result = monitorInferenceAccuracy({
      inference_id,
      agent_id,
      accuracy_percent,
      timestamp,
    });

    expect(result).toEqual({
      inference_id,
      agent_id,
      accuracy_percent: 0,
      accuracy_rank,
      alert_generated: true,
      alert_count: 1,
      alerts: [
        {
          alert_id: expect.any(String),
          alert_type,
          alert_severity,
          alert_message,
          inference_id,
          agent_id,
          accuracy_percent: 0,
          generated_at: expect.any(Date),
          status: '未処理',
        },
      ],
    });

    expect(result.accuracy_rank).toBe(accuracy_rank);
    expect(result.alert_generated).toBe(true);
    expect(result.alert_count).toBe(1);
    expect(result.alerts[0].alert_type).toBe(alert_type);
    expect(result.alerts[0].alert_severity).toBe(alert_severity);
    expect(result.alerts[0].alert_message).toBe(alert_message);
    expect(result.alerts[0].status).toBe('未処理');
  });
});