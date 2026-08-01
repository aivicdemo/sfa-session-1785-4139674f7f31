import { calculateInferenceAccuracyScore } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-491
  test('AIエージェント推論精度スコア算出機能 - 精度50%未満の場合スコアが50未満となる', () => {
    const correct_inferences = 40;
    const total_inferences = 100;
    const expected_accuracy_score = 40;

    const accuracy_score = calculateInferenceAccuracyScore({
      correct_inferences,
      total_inferences,
    });

    expect(accuracy_score).toBeLessThan(50);
    expect(accuracy_score).toBe(expected_accuracy_score);
  });
});