import { calculateInferenceAccuracy } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度監視機能', () => {
  // SCEN-325
  test('同じAIエージェント推論ログで2回実行した場合に同じ精度値が計算される', () => {
    const inference_log_data = {
      inference_id: 'AGENT-001',
      input_text: '営業機会スコア計算',
      output_result: 'スコア75',
      processing_time_ms: 1200,
      timestamp: new Date('2024-01-15T11:00:00Z'),
      model_version: '2.1.0',
      input_token_count: 45,
      output_token_count: 12,
      confidence_score: 0.92,
    };

    const first_execution_result = calculateInferenceAccuracy(inference_log_data);
    const second_execution_result = calculateInferenceAccuracy(inference_log_data);

    expect(first_execution_result).toBe(87.5);
    expect(second_execution_result).toBe(87.5);
    expect(first_execution_result - second_execution_result).toBe(0);
  });
});