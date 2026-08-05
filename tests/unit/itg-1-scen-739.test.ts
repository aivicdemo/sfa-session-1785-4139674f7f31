import { calculateAiInferenceAccuracyScore } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-739
  test('推論結果オブジェクトが null のときエラーがスローされること', () => {
    const null_inference_result = null;

    expect(() => {
      calculateAiInferenceAccuracyScore(null_inference_result);
    }).toThrow(/推論結果オブジェクト/);
  });
});