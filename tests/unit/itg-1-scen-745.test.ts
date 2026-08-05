import { calculateInferenceAccuracyScore } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-745
  test('推論精度スコア算出時に問題検出結果が null のときエラーになる', () => {
    const invalid_detection_result = null;
    const inference_input = {
      detectionResult: invalid_detection_result,
      inference_model_version: '1.0.0',
      evaluation_timestamp: new Date('2024-01-15T11:00:00Z'),
    };

    expect(() => calculateInferenceAccuracyScore(inference_input)).toThrow(
      /問題検出結果/
    );
  });
});