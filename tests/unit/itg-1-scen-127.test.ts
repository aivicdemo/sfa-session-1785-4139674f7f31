import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import { validateLearningDataQualityBeforeInference } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-127
  test('学習データ件数がゼロのとき推論実行が保留される', () => {
    const inference_request = {
      inference_id: 'inf_20240115_001',
      triggered_at: new Date('2024-01-15T11:00:00Z'),
      target_sales_rep_ids: ['rep_001', 'rep_002'],
      analysis_type: 'process_compliance_monitoring'
    };

    const learning_data_validation = {
      total_learning_records: 0,
      minimum_required_records: 100,
      data_quality_score: 0,
      minimum_quality_threshold: 0.85,
      validation_timestamp: new Date('2024-01-15T10:55:00Z')
    };

    const result = validateLearningDataQualityBeforeInference(
      inference_request,
      learning_data_validation
    );

    expect(result.inference_status).toBe('PENDING');
    expect(result.status_code).toBe(202);
    expect(result.message).toMatch(/学習データ件数が0件/);
    expect(result.message).toMatch(/推論は実行保留中/);
    expect(result.inference_task_queued).toBe(false);
    expect(result.inference_execution_started).toBe(false);
  });
});