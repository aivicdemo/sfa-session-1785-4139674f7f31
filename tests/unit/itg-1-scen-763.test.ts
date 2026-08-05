import { describe, test, expect, beforeEach } from '@jest/globals';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-763: [edge] AIエージェント推論精度評価機能 - 推論精度スコアが負の値のとき、0点以下の範囲境界を検出される
  test('should detect out-of-range error when inference accuracy score is negative', async () => {
    const { validateInferenceAccuracyScore } = await import(
      '../../src/logic/it-1-br-2-1-1-1'
    );

    const inputScore = -5.0;

    const result = validateInferenceAccuracyScore(inputScore);

    expect(result).toEqual({
      isValid: false,
      evaluationStatus: '不正値',
      errorCode: 'ERR_SCORE_OUT_OF_RANGE_NEGATIVE',
      errorMessage: 'スコア範囲エラー：入力値は0以上100以下である必要があります。入力値:-5.0',
      normalizedScore: null,
    });
  });
});