import { calculateAndRoundAiInferenceAccuracy } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-1164
  test('推論精度の計算で割り算により端数が発生するとき正確に丸められる', () => {
    const correct_count = 7;
    const total_evaluation_count = 3;
    const alert_threshold_percent = 2.50;

    const result = calculateAndRoundAiInferenceAccuracy({
      correct_count,
      total_evaluation_count,
      alert_threshold_percent,
    });

    expect(result.rounded_accuracy_percent).toBe(2.33);
    expect(result.should_alert).toBe(true);
    expect(result.alert_message).toMatch(/精度/);
  });
});