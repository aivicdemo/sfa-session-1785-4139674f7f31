import { validateAIInferenceReadiness } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論実行前データ品質検証機能', () => {
  // SCEN-126
  test('[error] 学習データ量が空（null）のとき推論実行が保留される', () => {
    const sales_process_audit_data = {
      process_id: 'PROC_001',
      sales_person_id: 'SP_001',
      customer_id: 'CUST_001',
      process_stage: 'initial_contact',
      process_timestamp: new Date('2024-01-15T10:00:00Z'),
      training_data_volume: null,
      data_quality_score: 95,
      min_training_data_required: 1000,
      quality_threshold: 90,
    };

    const result = validateAIInferenceReadiness(sales_process_audit_data);

    expect(result.status).toBe('STATUS_PENDING');
    expect(result.error_code).toBe('ERR_INVALID_TRAINING_DATA_VOLUME');
    expect(result.message).toMatch(/学習データ量がnullのため推論実行を保留しました/);
    expect(result.inference_engine_called).toBe(false);
  });
});