import { describe, test, expect } from '@jest/globals';
import { monitorInferenceAccuracy } from '../../src/logic/it-1-br-2-1-1-1';

// SCEN-433
describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  test('推論精度データが欠落している場合、エラーとして処理される', () => {
    const incompleteAccuracyData = {
      accuracy: undefined,
      precision: 0.85,
      recall: 0.78,
    };

    expect(() => monitorInferenceAccuracy(incompleteAccuracyData)).toThrow(/推論精度データが不完全です/);
  });
});