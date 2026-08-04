import { calculateRecommendationConfidenceScore } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-2418
  test('推奨精度スコア算出機能 - 推奨精度スコアが101点のときスコア値が0～100範囲外として処理される', () => {
    const result = calculateRecommendationConfidenceScore(101);

    expect(result).toHaveProperty('errorCode');
    expect(result).toHaveProperty('errorMessage');
    expect(result.errorCode).toBe('SCORE_OUT_OF_RANGE');
    expect(result.errorMessage).toMatch(/推奨精度スコアは0～100の範囲内である必要があります/);
  });
});