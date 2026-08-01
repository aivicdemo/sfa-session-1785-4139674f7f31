import { calculatePriorityScore } from '../../src/logic/it-1-br-2-1-1';

describe('営業担当者の行動パターンと成約実績の自動分析・レポート機能', () => {
  test('SCEN-681: 改善優先度スコア算出機能 - 問題パターンの影響度が最大値直下のとき優先度スコアが適切に計算される', () => {
    // Arrange
    const impact_score = 95;
    const frequency_score = 50;
    const difficulty_score = 50;

    // Act
    const priority_score = calculatePriorityScore({
      impact_score,
      frequency_score,
      difficulty_score,
    });

    // Assert
    expect(priority_score).toBeGreaterThan(95);
    expect(priority_score).toBeLessThanOrEqual(98);
    expect(priority_score).toBeCloseTo(97.5, 1);
  });
});