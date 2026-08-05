import { validateInferenceAccuracyThreshold } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-687
  test('推論精度の閾値が100を超える値のとき無効な設定としてエラーになる', () => {
    const invalidThresholdValue = 101;

    expect(() => {
      validateInferenceAccuracyThreshold(invalidThresholdValue);
    }).toThrow(/INVALID_THRESHOLD_EXCEEDED/);
  });
});