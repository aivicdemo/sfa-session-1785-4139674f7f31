import { calculateAIInferenceAccuracy } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度監視機能', () => {
  // SCEN-322: [normal] AIエージェント推論精度監視機能 - AIエージェント推論ログが1件の場合に精度が計算される
  test('推論ログ1件から推論精度を計算し、100%の精度と統計情報を返す', () => {
    const inference_log_id = 'INFER-001';
    const input_prompt = 'テスト';
    const output_result = 'テスト結果';
    const correct_label = 'テスト結果';
    const inference_timestamp = '2024-01-15T10:30:00Z';

    const input_data = {
      inference_id: inference_log_id,
      input_prompt: input_prompt,
      output_result: output_result,
      correct_label: correct_label,
      inference_timestamp: inference_timestamp,
    };

    const result = calculateAIInferenceAccuracy([input_data]);

    expect(result.accuracy_percentage).toBe(100.0);
    expect(result.total_logs_count).toBe(1);
    expect(result.correct_count).toBe(1);
    expect(result.incorrect_count).toBe(0);
  });
});