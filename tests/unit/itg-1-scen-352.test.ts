import { describe, test, expect, beforeEach } from '@jest/globals';
import { calculateInferenceAccuracy } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-352
  test('推論精度の計算結果がNaNのとき、エラーが発生する', () => {
    const inference_result = {
      agent_id: 'agent_001',
      inference_output: 'sample_output',
      actual_outcome: 'sample_outcome',
      match_flag: false,
    };

    expect(() => calculateInferenceAccuracy(inference_result)).toThrow(/INFERENCE_PRECISION_INVALID/);
  });
});