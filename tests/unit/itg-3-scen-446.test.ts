import { calculateWeightedQualityScore } from '../../src/logic/itg-3';

describe('品質スコア重み付け集計機能', () => {
  test('SCEN-446: 複数のカテゴリスコアが異なる値の場合、正しく加重平均される', () => {
    // Arrange: テスト用のカテゴリスコアを定義
    const categoryScores = {
      categoryA: 80,
      categoryB: 60,
      categoryC: 90,
    };

    // 各カテゴリに対する重み付け係数を定義
    const weights = {
      categoryA: 0.3,
      categoryB: 0.2,
      categoryC: 0.5,
    };

    // Act: 重み付け集計関数に上記のスコアと係数を入力
    const result = calculateWeightedQualityScore(categoryScores, weights);

    // Assert: 加重平均を計算して期待値と比較
    // (80 × 0.3) + (60 × 0.2) + (90 × 0.5) = 24 + 12 + 45 = 81
    const expectedScore = 81.0;
    expect(result).toBe(expectedScore);
  });
});