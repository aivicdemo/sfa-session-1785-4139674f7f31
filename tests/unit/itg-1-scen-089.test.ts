import { validateAIInferenceReadiness } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-089
  test('営業活動ログが空の場合、推論実行が保留される', () => {
    const target_user_id = 'user_001';
    const training_data_records = [];
    const expected_can_execute_inference = false;
    const expected_hold_reason_code = 'INSUFFICIENT_TRAINING_DATA';
    const expected_inference_status = 'PENDING_DATA_COLLECTION';
    const expected_queued_job_count = 0;

    const result = validateAIInferenceReadiness({
      user_id: target_user_id,
      sales_activity_logs: training_data_records,
    });

    expect(result.can_execute_inference).toBe(expected_can_execute_inference);
    expect(result.hold_reason_code).toBe(expected_hold_reason_code);
    expect(result.inference_execution_status).toBe(expected_inference_status);
    expect(result.inference_task_queue_job_count).toBe(expected_queued_job_count);
  });
});