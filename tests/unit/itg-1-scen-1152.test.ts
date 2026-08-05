import { calculateActionDeviationRate } from '../../src/logic/it-1-br-target4-1-1-1';

describe('営業担当者ごとの行動パターン分析レポート生成機能', () => {
  // SCEN-1152
  test('乖離率の計算で割り算により端数が発生するとき正確に丸められる', () => {
    const targetAchievementCount = 3;
    const actualAchievementCount = 1;

    const deviationRate = calculateActionDeviationRate(
      targetAchievementCount,
      actualAchievementCount
    );

    expect(deviationRate).toBe(66.67);
  });
});