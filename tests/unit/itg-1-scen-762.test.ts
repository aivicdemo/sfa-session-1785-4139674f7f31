import { describe, test, expect } from '@jest/globals';
import { evaluateInferenceConfidence } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-762
  test('[edge] AIエージェント推論精度評価機能 - 推論精度スコアがちょうど100点（最大値）のとき、最高信頼度と判定される', () => {
    const inferenceAccuracyScore = 100;
    const result = evaluateInferenceConfidence({
      score: inferenceAccuracyScore,
    });

    expect(result.confidenceLevel).toBe('HIGHEST');
    expect(result.confidenceScore).toBe(100);
    expect(result.trustStatus).toBe('APPROVED_RECOMMENDED');
  });
});