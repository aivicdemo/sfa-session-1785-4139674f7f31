import { calculateWeightedScoreFromSuccessRate } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン抽出・重み付けロジック', () => {
  // SCEN-2819
  test('過去商談データの成功率が50%を超えるとき、重み付けスコアが上昇方向に計算される', () => {
    const baselineScore = 50;
    const successRateAboveThreshold = 50.1;
    
    const pastDealData = {
      totalDeals: 1000,
      successfulDeals: 501,
      successRate: successRateAboveThreshold,
      customerAttributes: {
        industry: 'manufacturing',
        scale: 'large',
      },
      dealConditions: {
        productCategory: 'enterprise_solution',
        dealValue: 5000000,
      },
    };

    const weightedScore = calculateWeightedScoreFromSuccessRate(pastDealData);

    expect(weightedScore).toBeGreaterThan(baselineScore);
    expect(typeof weightedScore).toBe('number');
    expect(weightedScore).toBeGreaterThan(0);
  });
});