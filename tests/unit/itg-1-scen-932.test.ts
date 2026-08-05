import { calculateImprovementPriorityScore } from '../../src/logic/it-1-br-2-1-1';

describe('改善優先度スコア算出機能', () => {
  // SCEN-932
  test('低影響度・低発生頻度の問題パターンが低優先度になる', () => {
    const impact_degree = 1;
    const occurrence_frequency = 1;

    const result = calculateImprovementPriorityScore({
      impact_degree,
      occurrence_frequency,
    });

    expect(result.priority_score).toBeGreaterThanOrEqual(0);
    expect(result.priority_score).toBeLessThanOrEqual(20);
    expect(result.priority_level).toBe('低');
  });
});