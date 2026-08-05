import { calculateAiInferenceAccuracy } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度監視機能', () => {
  // SCEN-093
  test('抽出された営業プロセスログから推論精度が正常に自動計算される', () => {
    const inference_logs = Array.from({ length: 100 }, (_, index) => ({
      log_id: `log_${index + 1}`,
      inference_result: index < 85 ? 'success' : 'failure',
      correct_label: index < 85 ? 'success' : 'failure',
    }));

    const result = calculateAiInferenceAccuracy(inference_logs);

    expect(result.correct_count).toBe(85);
    expect(result.incorrect_count).toBe(15);
    expect(result.accuracy_percentage).toBe(85.0);
  });
});