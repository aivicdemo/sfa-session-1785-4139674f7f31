import { calculateInferenceAccuracy } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-460
  test('should not generate alert when inference accuracy equals threshold', () => {
    const alert_threshold = 85.0;
    const inference_accuracy = 85.0;
    
    const monitoring_logs: Array<{ accuracy: number; threshold: number; status: string; timestamp: Date }> = [];
    const alert_records: Array<{ agent_id: string; accuracy: number; threshold: number; alert_generated_at: Date }> = [];
    
    const agent_id = 'agent_001';
    const inference_timestamp = new Date('2024-01-15T11:00:00Z');
    
    const result = calculateInferenceAccuracy({
      agent_id,
      accuracy_percentage: inference_accuracy,
      threshold_percentage: alert_threshold,
      timestamp: inference_timestamp,
      monitoring_logs,
      alert_records
    });
    
    expect(result.alert_generated).toBe(false);
    expect(result.monitoring_log_entry.accuracy).toBe(85.0);
    expect(result.monitoring_log_entry.threshold).toBe(85.0);
    expect(result.monitoring_log_entry.status).toBe('精度85.0% - 閾値内');
    expect(alert_records.length).toBe(0);
  });
});