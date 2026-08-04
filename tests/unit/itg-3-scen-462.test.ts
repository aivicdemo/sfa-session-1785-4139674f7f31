import { calculateImprovementRate } from '../../src/logic/itg-3';

describe('AIエージェント推奨支援システム - 改善実績トラッキング機能', () => {
  // SCEN-462
  test('改善前スコアから改善後スコアへの変化が正の場合、改善度が正しく算出される', () => {
    const beforeScore = 60;
    const afterScore = 85;
    const expectedImprovementRate = 41.67;

    const result = calculateImprovementRate(beforeScore, afterScore);

    expect(result).toBe(expectedImprovementRate);
  });
});