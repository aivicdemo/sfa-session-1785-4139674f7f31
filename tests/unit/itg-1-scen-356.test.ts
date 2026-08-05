import { calculateAiInferenceAccuracyHealthCheckResult } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-356
  test('システムヘルスチェック合格判定機能 - AIエージェント推論精度が合格基準値を超える場合に合格と判定される', () => {
    const current_inference_accuracy_percent = 75;
    const pass_threshold_percent = 70;

    const result = calculateAiInferenceAccuracyHealthCheckResult(
      current_inference_accuracy_percent,
      pass_threshold_percent
    );

    expect(result.is_passed).toBe(true);
    expect(result.status).toBe('PASS');
    expect(result.reason).toBe(
      'AIエージェント推論精度75%が合格基準値70%を超過している'
    );
  });
});