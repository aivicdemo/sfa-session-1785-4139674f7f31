import { calculateRecommendationConfidenceScore } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-877: [edge] 推奨信頼度スコア算出機能 - 推奨生成から推奨提示までの期間が1日のとき信頼度スコアに減衰が適用される
  test('推奨生成から1日経過後の推奨提示時に信頼度スコアに減衰係数0.95が適用されて95.0になる', () => {
    // Arrange
    const initial_confidence_score = 100.0;
    const generated_at = new Date('2024-01-15T10:00:00Z');
    const presented_at = new Date('2024-01-16T10:00:00Z');
    const elapsed_hours = 24;
    const decay_coefficient = 0.95;
    const expected_score = initial_confidence_score * decay_coefficient;

    // Act
    const actual_score = calculateRecommendationConfidenceScore(
      generated_at,
      presented_at
    );

    // Assert
    expect(actual_score).toBe(95.0);
  });
});