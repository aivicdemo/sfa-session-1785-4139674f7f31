import { monitorInferenceAccuracy } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-685
  test('推論精度の閾値設定が null のときアラート判定処理がエラーになる', () => {
    const inference_accuracy = 0.85;
    const threshold = null;

    const executeMonitoring = () => {
      monitorInferenceAccuracy({
        inference_accuracy,
        threshold
      });
    };

    expect(executeMonitoring).toThrow(/Threshold value is null or undefined/);
  });
});