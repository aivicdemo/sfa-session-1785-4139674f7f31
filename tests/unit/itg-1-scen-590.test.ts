import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import { calculateInferenceAccuracyStatus } from '../../src/logic/it-1-br-2-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-590: [edge] 推論精度が監視閾値直下（閾値-0.01%）である場合
  test('推論精度84.99%（閾値-0.01%）時点ではアラート非生成、警告レベルで記録', () => {
    const threshold_percent = 85.00;
    const current_accuracy_percent = 84.99;
    const previous_accuracy_percent = 84.50;

    const result = calculateInferenceAccuracyStatus({
      current_accuracy_percent,
      threshold_percent,
      previous_accuracy_percent,
      monitoring_cycle_id: 'monitoring_202401',
      measurement_timestamp: new Date('2024-01-15T10:00:00Z'),
    });

    expect(result.alert_generated).toBe(false);
    expect(result.status).toBe('正常範囲内');
    expect(result.alert_level).toBe('警告');
    expect(result.is_within_threshold).toBe(false);
    expect(result.accuracy_gap_percent).toBe(-0.01);
    expect(result.audit_message).toMatch(/推論精度が監視閾値\(85\.00%\)に接近中.*84\.99%/);
    expect(result.audit_message_recorded).toBe(true);
  });
});