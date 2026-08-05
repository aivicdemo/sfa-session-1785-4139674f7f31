import { describe, test, expect } from '@jest/globals';
import { analyzeAiInferenceAccuracy } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-1185
  test('営業プロセス標準書が null のとき処理がエラーになる', () => {
    const input = {
      processStandardBook: null,
      inferenceLogData: [
        {
          inferenceId: 'inference_001',
          timestamp: '2024-01-15T10:00:00Z',
          input: { customerId: 'C001', stageId: 'S001' },
          output: { recommendedAction: 'follow_up', confidence: 0.87 },
          actualOutcome: 'success',
        },
      ],
      evaluationThreshold: 0.85,
    };

    expect(() => analyzeAiInferenceAccuracy(input)).toThrow(/営業プロセス標準書/);
  });
});