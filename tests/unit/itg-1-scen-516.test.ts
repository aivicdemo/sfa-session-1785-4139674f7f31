import { calculateInferenceAccuracyScore } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-516
  test('AIエージェント推論精度スコア算出機能 - 営業担当者の行動パターン分析結果のスコアが0～100の範囲内の場合、精度スコアが正しく算出される', () => {
    const visit_frequency_score = 45;
    const proposal_success_rate_score = 72;
    const customer_satisfaction_score = 88;

    const accuracy_score = calculateInferenceAccuracyScore({
      visit_frequency_score,
      proposal_success_rate_score,
      customer_satisfaction_score,
    });

    const expected_accuracy_score = 68.3;

    expect(accuracy_score).toBe(expected_accuracy_score);
    expect(accuracy_score).toBeGreaterThanOrEqual(0);
    expect(accuracy_score).toBeLessThanOrEqual(100);
  });
});