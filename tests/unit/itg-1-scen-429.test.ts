import { calculateInferenceAccuracy } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  test('SCEN-429: 監視対象となるAIエージェント推論ログが1件の場合、その1件に対して精度が評価される', () => {
    const inferenceLog = {
      inference_id: 'AGT-001',
      inference_result: 75,
      correct_value: 78,
      evaluation_timestamp: new Date('2024-01-15T11:00:00Z').toISOString(),
    };

    const result = calculateInferenceAccuracy([inferenceLog]);

    const absolute_difference = Math.abs(75 - 78);
    const max_possible_error = 3;
    const expected_accuracy_score = 1 - (absolute_difference / max_possible_error);
    const expected_accuracy_percentage = expected_accuracy_score * 100;

    expect(result.accuracy_score).toBeCloseTo(expected_accuracy_percentage, 2);
    expect(result.evaluated_log_count).toBe(1);
    expect(result.alert_generated).toBe(false);
  });
});