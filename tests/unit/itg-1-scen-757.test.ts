import { describe, test, expect } from '@jest/globals';
import { calculateInferenceAccuracyScore } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-757
  test('should throw error when sample size is 0 or less during inference accuracy score calculation', () => {
    const invalid_sample_size_zero = 0;
    const metrics = {
      total_predictions: 100,
      correct_predictions: 85,
      precision: 0.85,
      recall: 0.80,
      f1_score: 0.825,
    };

    expect(() =>
      calculateInferenceAccuracyScore(metrics, invalid_sample_size_zero)
    ).toThrow(/Sample size must be greater than 0/);
  });
});