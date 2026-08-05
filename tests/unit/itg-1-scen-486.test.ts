import { calculateInferenceAccuracyScore } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-486
  test('推論精度スコアが100を超える場合、エラーを返す', () => {
    const mockInferenceMetrics = {
      total_inferences: 100,
      correct_predictions: 101,
      timestamp: '2024-01-15T11:00:00Z',
    };

    const result = calculateInferenceAccuracyScore(mockInferenceMetrics);

    expect(result.status_code).toBe(400);
    expect(result.error_code).toBe('INFERENCE_SCORE_EXCEEDED');
    expect(result.error_message).toBe(
      '推論精度スコアが上限値（100）を超えています。現在のスコア: 101'
    );
  });
});