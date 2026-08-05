import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import { validateAIAgentInferenceAccuracy } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // SCEN-692
  test('実測精度値が100を超える値のとき無効なデータとしてエラーになる', () => {
    const invalid_accuracy_value = 101.5;

    expect(() =>
      validateAIAgentInferenceAccuracy({
        measured_accuracy: invalid_accuracy_value,
        timestamp: new Date('2024-01-15T11:00:00Z'),
      })
    ).toThrow(/精度値は0～100の範囲内である必要があります/);
  });
});