import { describe, test, expect } from '@jest/globals';
import { validateAndCompareAccuracy } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-690
  test('実測精度値が null のとき閾値比較処理がエラーになる', () => {
    const monitoring_data = {
      measured_accuracy: null,
      threshold_lower: 85,
      threshold_upper: 95,
    };

    expect(() => validateAndCompareAccuracy(monitoring_data)).toThrow(/精度値/);
  });
});