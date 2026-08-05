import { calculateInferenceAccuracyScore } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-758
  test('推論精度スコア算出時に評価メトリクスデータが null のときエラーになる', () => {
    const nullMetricsData = null;

    expect(() => {
      calculateInferenceAccuracyScore(nullMetricsData);
    }).toThrow(/評価メトリクスデータが存在しません/);
  });
});