import { evaluateRecommendationAccuracy } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-373
  test('検証対象期間が未指定のとき、精度検証がエラーになる', () => {
    const inputWithoutPeriod = {
      verificationStartDate: undefined,
      verificationEndDate: undefined,
      recommendationIds: ['rec-001', 'rec-002'],
    };

    expect(() => evaluateRecommendationAccuracy(inputWithoutPeriod))
      .toThrow(/検証対象期間/);
  });
});