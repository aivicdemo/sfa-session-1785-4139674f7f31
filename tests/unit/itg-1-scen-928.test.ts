import { calculatePriorityScores } from '../../src/logic/it-1-br-2-1-1';

describe('営業担当者の行動パターンと成約実績の自動分析・レポート機能', () => {
  // SCEN-928
  test('改善優先度スコア算出機能 - 複数の問題パターンについて改善優先度スコアが降順でソートされる', () => {
    const problem_pattern_1 = {
      pattern_id: 'P001',
      occurrence_frequency: 8,
      sales_impact: 9,
      solution_difficulty: 5,
      customer_satisfaction_impact: 7,
    };

    const problem_pattern_2 = {
      pattern_id: 'P002',
      occurrence_frequency: 6,
      sales_impact: 8,
      solution_difficulty: 6,
      customer_satisfaction_impact: 5,
    };

    const problem_pattern_3 = {
      pattern_id: 'P003',
      occurrence_frequency: 4,
      sales_impact: 7,
      solution_difficulty: 8,
      customer_satisfaction_impact: 4,
    };

    const problem_patterns = [
      problem_pattern_1,
      problem_pattern_2,
      problem_pattern_3,
    ];

    const result = calculatePriorityScores(problem_patterns);

    expect(result).toHaveLength(3);

    expect(result[0].pattern_id).toBe('P001');
    expect(result[0].priority_score).toBe(85);

    expect(result[1].pattern_id).toBe('P002');
    expect(result[1].priority_score).toBe(72);

    expect(result[2].pattern_id).toBe('P003');
    expect(result[2].priority_score).toBe(58);

    for (let i = 0; i < result.length - 1; i++) {
      expect(result[i].priority_score).toBeGreaterThanOrEqual(
        result[i + 1].priority_score
      );
    }
  });
});