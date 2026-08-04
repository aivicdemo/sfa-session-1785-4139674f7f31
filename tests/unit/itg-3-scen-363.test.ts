import { validateRecommendationAccuracyThreshold } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-363
  test('設定閾値が100%を超えるとき、精度検証がエラーになる', () => {
    const invalidThreshold = 100.5;

    expect(() => {
      validateRecommendationAccuracyThreshold({
        threshold: invalidThreshold,
      });
    }).toThrow(/threshold exceeds 100%/);
  });
});