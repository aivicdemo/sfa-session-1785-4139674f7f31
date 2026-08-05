import { linkInferenceLogsWithAccuracyData } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-626: [error] 推論ログと推論精度データの紐付けIDが一致しないときエラーになる
  test('推論ログと推論精度データの紐付けIDが一致しない場合、エラーコード MISMATCH_INFERENCE_ID を返す', () => {
    const inferenceLog = {
      inference_id: 'INF-20240115-001',
      timestamp: '2024-01-15T10:30:45Z',
      model_version: '1.0',
      input_data: { customer_id: 'C001', sales_stage: 'proposal' },
      output_result: { recommendation: 'follow_up_timing', confidence: 0.87 },
    };

    const accuracyData = {
      accuracy_id: 'ACC-20240115-002',
      related_inference_id: 'INF-20240115-002',
      actual_outcome: 'customer_responded',
      accuracy_score: 0.92,
      evaluation_timestamp: '2024-01-15T14:20:00Z',
    };

    const result = linkInferenceLogsWithAccuracyData(inferenceLog, accuracyData);

    expect(result.success).toBe(false);
    expect(result.error_code).toBe('MISMATCH_INFERENCE_ID');
    expect(result.error_message).toMatch(/推論ID/);
    expect(result.error_message).toMatch(/INF-20240115-001/);
    expect(result.error_message).toMatch(/ACC-20240115-002/);
    expect(result.error_message).toMatch(/紐付けに失敗/);
    expect(result.unlinked_records).toEqual({
      inference_id: 'INF-20240115-001',
      accuracy_id: 'ACC-20240115-002',
      related_inference_id: 'INF-20240115-002',
    });
  });
});