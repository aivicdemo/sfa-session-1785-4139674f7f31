import { calculateInferenceAccuracyScore } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-511
  test('[normal] AIエージェント推論精度スコア算出機能 - 精度スコアの計算結果に端数が発生した場合、小数第1位で四捨五入される', () => {
    const correct_count = 3;
    const total_questions = 7;

    const accuracy_score = calculateInferenceAccuracyScore({
      correct_count,
      total_questions,
    });

    expect(accuracy_score).toBe(42.9);
  });
});