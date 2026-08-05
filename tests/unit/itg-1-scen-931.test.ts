import { calculateImprovementPriorityScore } from '../../src/logic/it-1-br-2-1-1';

describe('改善優先度スコア算出機能', () => {
  // SCEN-931: [normal] 改善優先度スコア算出機能 - 高影響度・高発生頻度の問題パターンが最高優先度になる
  test('高影響度・高発生頻度の問題パターンが最高優先度スコア81となり、他のパターンより優先される', () => {
    const improvement_problem_patterns = [
      {
        problem_pattern_id: 'pattern_001',
        impact_score: 9,
        occurrence_frequency_score: 9,
      },
      {
        problem_pattern_id: 'pattern_002',
        impact_score: 5,
        occurrence_frequency_score: 3,
      },
    ];

    const result = calculateImprovementPriorityScore(improvement_problem_patterns);

    expect(result).toEqual([
      {
        problem_pattern_id: 'pattern_001',
        priority_score: 81,
      },
      {
        problem_pattern_id: 'pattern_002',
        priority_score: 15,
      },
    ]);

    const highest_priority_pattern = result[0];
    expect(highest_priority_pattern.priority_score).toBe(81);
    expect(highest_priority_pattern.priority_score).toBeGreaterThan(result[1].priority_score);
  });
});