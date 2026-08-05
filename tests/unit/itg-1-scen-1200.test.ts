import { describe, test, expect } from '@jest/globals';
import { validateInferenceAccuracy } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-1200
  test('推論精度が負の値のとき処理がエラーになる', () => {
    const negativeAccuracy = -0.5;

    expect(() => {
      validateInferenceAccuracy(negativeAccuracy);
    }).toThrow(/推論精度は0以上1以下の値である必要があります/);
  });
});