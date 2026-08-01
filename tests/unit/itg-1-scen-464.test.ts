import { describe, test, expect, beforeEach } from '@jest/globals';
import { calculateInferenceAccuracy } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-464
  test('複数件のAIエージェント推論ログから推論精度が正確に計算される', () => {
    const inference_logs = [
      {
        inference_id: 'infer_001',
        inference_timestamp: new Date('2024-01-15T10:00:00Z'),
        input_data: { customer_id: 'cust_101', proposal_type: 'product_a' },
        inference_result: 'recommendation_approved',
        actual_result: 'recommendation_approved',
        is_correct: true,
      },
      {
        inference_id: 'infer_002',
        inference_timestamp: new Date('2024-01-15T10:15:00Z'),
        input_data: { customer_id: 'cust_102', proposal_type: 'product_b' },
        inference_result: 'recommendation_rejected',
        actual_result: 'recommendation_approved',
        is_correct: false,
      },
      {
        inference_id: 'infer_003',
        inference_timestamp: new Date('2024-01-15T10:30:00Z'),
        input_data: { customer_id: 'cust_103', proposal_type: 'product_a' },
        inference_result: 'recommendation_approved',
        actual_result: 'recommendation_approved',
        is_correct: true,
      },
      {
        inference_id: 'infer_004',
        inference_timestamp: new Date('2024-01-15T10:45:00Z'),
        input_data: { customer_id: 'cust_104', proposal_type: 'product_c' },
        inference_result: 'recommendation_approved',
        actual_result: 'recommendation_rejected',
        is_correct: false,
      },
      {
        inference_id: 'infer_005',
        inference_timestamp: new Date('2024-01-15T11:00:00Z'),
        input_data: { customer_id: 'cust_105', proposal_type: 'product_b' },
        inference_result: 'recommendation_rejected',
        actual_result: 'recommendation_rejected',
        is_correct: true,
      },
    ];

    const start_date = new Date('2024-01-15T09:00:00Z');
    const end_date = new Date('2024-01-15T12:00:00Z');

    const accuracy_result = calculateInferenceAccuracy(
      inference_logs,
      start_date,
      end_date
    );

    expect(accuracy_result.accuracy_score).toBe(60);
    expect(accuracy_result.correct_count).toBe(3);
    expect(accuracy_result.total_count).toBe(5);
  });
});