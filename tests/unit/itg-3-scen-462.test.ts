import { calculateImprovementRate } from '../../src/logic/itg-3';

describe('改善実績トラッキング機能', () => {
  // SCEN-462
  test('改善前スコアから改善後スコアへの変化が正の場合、改善度が正しく算出される', () => {
    const beforeScore = 60;
    const afterScore = 85;
    
    const improvementRate = calculateImprovementRate(beforeScore, afterScore);
    
    expect(improvementRate).toBe(41.67);
  });
});