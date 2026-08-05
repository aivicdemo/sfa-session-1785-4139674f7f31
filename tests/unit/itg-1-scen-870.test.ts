import { calculateImprovementPriority } from '../../src/logic/it-1-br-2-1-1';

describe('改善優先度判定機能', () => {
  test('SCEN-870: 乖離度が大きい営業担当者が高優先度に判定される', () => {
    const salesRepAchievementRateA = 0.60;
    const benchmarkAchievementRate = 0.85;
    const deviationA = salesRepAchievementRateA - benchmarkAchievementRate;
    const absoluteDeviationA = Math.abs(deviationA);

    const salesRepAchievementRateB = 0.95;
    const deviationB = salesRepAchievementRateB - benchmarkAchievementRate;
    const absoluteDeviationB = Math.abs(deviationB);

    const salesRepDataA = {
      salesRepId: 'rep-001',
      achievementRate: salesRepAchievementRateA,
      targetAchievementRate: benchmarkAchievementRate,
    };

    const salesRepDataB = {
      salesRepId: 'rep-002',
      achievementRate: salesRepAchievementRateB,
      targetAchievementRate: benchmarkAchievementRate,
    };

    const resultA = calculateImprovementPriority(salesRepDataA);
    const resultB = calculateImprovementPriority(salesRepDataB);

    expect(resultA.deviation).toBe(-0.25);
    expect(resultB.deviation).toBe(0.10);
    expect(Math.abs(resultA.deviation)).toBeGreaterThan(Math.abs(resultB.deviation));
    expect(resultA.priorityRank).toBe('high');
    expect(resultB.priorityRank).toBe('low');
  });
});