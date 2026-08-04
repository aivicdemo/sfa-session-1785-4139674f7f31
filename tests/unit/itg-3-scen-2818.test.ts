import { calculateWeightedScore } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン抽出・重み付けロジック', () => {
  // SCEN-2818
  test('成功率が50%未満のとき、重み付けスコアが低下方向に計算される', () => {
    const successRate = 0.45; // 45%
    const baselineScore = 100;
    const newCaseCondition = {
      customerIndustry: '製造業',
      dealSize: 5000000,
      salesStage: '提案段階',
    };

    const weightedScore = calculateWeightedScore(
      successRate,
      baselineScore,
      newCaseCondition
    );

    const expectedScore = baselineScore * (successRate / 0.5);

    expect(weightedScore).toBeLessThanOrEqual(90);
    expect(weightedScore).toBe(expectedScore);
    expect(weightedScore).toBe(90);
  });
});