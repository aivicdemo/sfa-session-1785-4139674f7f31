import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import { calculateInferenceAccuracyScore } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-461
  test('AIエージェント推論ログの推論結果精度が監視テーブルに記録され、正常に推論精度スコアが算出される', () => {
    // Arrange
    const inference_id = 'INF-20240115-001';
    const inference_type = '営業機会判定';
    const inference_result = '高確度リード';
    const actual_result = '高確度リード';
    const monitoring_timestamp = new Date('2024-01-15T09:30:00Z');

    const inference_log_record = {
      inference_id,
      inference_type,
      inference_result,
      actual_result,
      created_at: new Date('2024-01-15T09:00:00Z'),
    };

    // Act
    const accuracy_score = calculateInferenceAccuracyScore({
      inference_result: inference_log_record.inference_result,
      actual_result: inference_log_record.actual_result,
    });

    const monitoring_record = {
      inference_id: inference_log_record.inference_id,
      accuracy_score: accuracy_score,
      monitoring_timestamp: monitoring_timestamp,
      accuracy_status: accuracy_score === 1.0 ? 'normal' : 'warning',
    };

    // Assert
    expect(accuracy_score).toBe(1.0);
    expect(monitoring_record.inference_id).toBe('INF-20240115-001');
    expect(monitoring_record.accuracy_score).toBe(1.0);
    expect(monitoring_record.accuracy_status).toBe('normal');
    expect(monitoring_record.monitoring_timestamp).toEqual(
      new Date('2024-01-15T09:30:00Z')
    );
  });
});