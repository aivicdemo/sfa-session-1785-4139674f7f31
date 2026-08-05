import { describe, test, expect } from '@jest/globals';
import { calculateAiInferenceAccuracyScore } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-753
  test('推論ログIDがnullの場合、エラーをthrowする', () => {
    const inferenceInput = {
      inferenceLogId: null as any,
      modelVersion: '1.0.0',
      predictedValue: 0.85,
      actualValue: 0.9,
      confidence: 0.92,
    };

    expect(() => calculateAiInferenceAccuracyScore(inferenceInput)).toThrow(/推論ログID/);
  });
});