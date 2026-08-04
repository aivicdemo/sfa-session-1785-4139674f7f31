import { calculateWeightedQualityScore } from '../../src/logic/itg-3';

describe('AIエージェント推奨支援システム - 品質スコア重み付け集計機能', () => {
  // SCEN-446
  test('複数のカテゴリスコアが異なる値の場合、正しく加重平均される', () => {
    const categoryScores = {
      categoryA: 80,
      categoryB: 60,
      categoryC: 90,
    };

    const weights = {
      categoryA: 0.3,
      categoryB: 0.2,
      categoryC: 0.5,
    };

    const result = calculateWeightedQualityScore(categoryScores, weights);

    const expectedValue = (80 * 0.3) + (60 * 0.2) + (90 * 0.5);

    expect(result).toBe(81.0);
  });
});