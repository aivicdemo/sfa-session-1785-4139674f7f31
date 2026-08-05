import { calculateInferenceAccuracyScore } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-464
  test('同一の推論ログについて2回精度監視を実行した場合、同じ精度スコアが計算される', () => {
    const inference_log_input = {
      inference_id: 'LOG-001',
      input_text: '顧客Aの契約更新フロー進捗は80%',
      inference_result: '更新見込み高',
      confidence_score: 0.92,
    };

    const scoreA = calculateInferenceAccuracyScore(inference_log_input);
    const scoreB = calculateInferenceAccuracyScore(inference_log_input);

    expect(scoreA).toBe(0.92);
    expect(scoreB).toBe(0.92);
    expect(scoreA).toEqual(scoreB);
  });
});