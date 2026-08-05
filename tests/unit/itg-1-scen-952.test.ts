import { calculateImprovementPriorityScore } from '../../src/logic/it-1-br-2-1-1';

describe('営業担当者の行動パターンと成約実績の自動分析・レポート機能', () => {
  test('SCEN-952: 改善優先度スコア算出機能 - 影響度と発生頻度の積が優先度スコア上限値未満のとき、計算値がそのまま記録される', () => {
    // Arrange
    const impact_degree = 5;
    const occurrence_frequency = 3;
    const priority_score_limit = 20;
    const expected_priority_score = 15;

    // Act
    const result = calculateImprovementPriorityScore({
      impact_degree,
      occurrence_frequency,
      priority_score_limit,
    });

    // Assert
    expect(result.priority_score).toBe(expected_priority_score);
    expect(result.is_recorded).toBe(true);
    expect(result.adjustment_applied).toBe(false);
  });
});