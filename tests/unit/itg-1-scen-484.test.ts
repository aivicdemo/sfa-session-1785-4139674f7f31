import { evaluateInferenceAccuracy } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-484
  test('推論精度の閾値が未定義の場合、エラーを返す', () => {
    const inference_result_id = 'inf_result_001';
    const predicted_label = 'success_pattern_a';
    const actual_label = 'success_pattern_a';
    const confidence_score = 0.92;
    const accuracy_threshold = null;
    const error_code_expected = 'ERR_THRESHOLD_UNDEFINED';
    const error_message_expected = '推論精度の閾値が定義されていません';

    expect(() =>
      evaluateInferenceAccuracy({
        inference_result_id,
        predicted_label,
        actual_label,
        confidence_score,
        accuracy_threshold,
      })
    ).toThrow(/閾値/);
  });
});