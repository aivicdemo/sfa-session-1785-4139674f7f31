import { calculateAIInferenceAccuracyScore } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-517
  test('AIエージェント推論精度スコア算出機能 - 監視状態が異常の場合、精度スコアが異常フラグ付きで算出される', () => {
    const input = {
      monitoring_status: 'abnormal',
      inferred_count: 100,
      correct_count: 85,
      inference_execution_at: new Date('2024-01-15T10:00:00Z'),
    };

    const result = calculateAIInferenceAccuracyScore(input);

    expect(result).toEqual({
      accuracy_score: 0,
      is_abnormal: true,
      calculated_at: expect.any(String),
    });
    expect(result.is_abnormal).toBe(true);
    expect(result.accuracy_score).toBe(0);
  });
});