import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  test('SCEN-764: 推論精度スコアが100を超える値のとき、上限範囲超過を検出される', async () => {
    const { validateInferenceAccuracyScore } = await import('../../src/logic/it-1-br-2-1-1-1');

    const input_accuracy_score = 100.5;

    expect(() => {
      validateInferenceAccuracyScore(input_accuracy_score);
    }).toThrow(/推論精度スコア|スコア上限/);
  });
});