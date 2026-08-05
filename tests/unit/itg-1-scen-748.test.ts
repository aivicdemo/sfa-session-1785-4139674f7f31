import { calculateInferenceAccuracyScore } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-748
  test('[error] AIエージェント推論精度評価機能 - AIエージェント推論精度スコア算出時に信頼度パラメータが 100 を超えるときエラーになる', () => {
    const input = {
      confidenceParameter: 101,
      correctPredictions: 95,
      totalPredictions: 100,
    };

    expect(() => calculateInferenceAccuracyScore(input)).toThrow(/信頼度パラメータ/);
  });
});