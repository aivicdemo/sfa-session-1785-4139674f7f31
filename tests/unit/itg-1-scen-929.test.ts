import { calculateImprovementPriorityScore } from '../../src/logic/it-1-br-2-1-1';

describe('改善優先度スコア算出機能', () => {
  // SCEN-929
  test('問題パターンが1件のときに改善優先度スコアが算出される', () => {
    const problem_patterns = [
      {
        pattern_id: 'PATTERN_001',
        pattern_name: '提案内容の標準プロセス乖離',
        occurrence_frequency: 5,
        impact_degree: 8,
        detection_difficulty: 6,
      },
    ];

    const result = calculateImprovementPriorityScore(problem_patterns);

    expect(typeof result).toBe('number');
    expect(result).toBeGreaterThanOrEqual(0);
    expect(result).toBeLessThanOrEqual(100);

    const expected_score =
      (problem_patterns[0].occurrence_frequency * 0.3 +
        problem_patterns[0].impact_degree * 0.5 +
        problem_patterns[0].detection_difficulty * 0.2) /
      10;
    expect(result).toBe(expected_score);
  });
});