import { monitorInferenceAccuracy } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-459
  test('AIエージェントの推論精度が閾値直下の場合、アラートが発生しない', () => {
    const alertThreshold = 95;
    const inferenceAccuracy = 94.9;

    const result = monitorInferenceAccuracy({
      inferenceAccuracy,
      alertThreshold,
    });

    expect(result.alertGenerated).toBe(false);
    expect(result.alertLogCount).toBe(0);
    expect(result.systemStatus).toBe('normal');
  });
});