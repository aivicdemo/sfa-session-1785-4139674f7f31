import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import { validateInferenceAccuracyThreshold } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-563
  test('推論精度の閾値が0未満の場合、エラーになる', () => {
    const invalid_threshold = -0.5;

    expect(() => {
      validateInferenceAccuracyThreshold(invalid_threshold);
    }).toThrow(/推論精度の閾値は0以上1以下の値を指定してください/);
  });
});