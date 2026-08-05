import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import { validateAlertThreshold } from '../../src/logic/it-1-br-2-1-1-1';

describe('AI推論精度の自動監視とアラート機能', () => {
  // SCEN-1202
  test('アラート閾値が null のとき処理がエラーになる', () => {
    const nullThreshold = null;
    const inferenceAccuracyScore = 0.75;

    expect(() => {
      validateAlertThreshold(nullThreshold, inferenceAccuracyScore);
    }).toThrow(/アラート閾値/);
  });
});