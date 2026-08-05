import { calculateInferenceAccuracyScore } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-740
  test('推論結果オブジェクトが undefined のときエラーをスロー', () => {
    expect(() => {
      calculateInferenceAccuracyScore(undefined as any);
    }).toThrow(/推論結果オブジェクト|Inference result object/);
  });
});