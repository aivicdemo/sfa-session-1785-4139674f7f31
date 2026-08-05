import { calculateImprovementPriority } from '../../src/logic/it-1-br-2-1-1';

describe('改善優先度スコア算出機能 - 複数パターン同位性', () => {
  // SCEN-956
  test('複数の問題パターンが同一の優先度スコアを持つとき、すべてが同位として記録される', () => {
    const pattern_a = {
      pattern_id: 'A001',
      occurrence_frequency_score: 8,
      impact_score: 6,
      response_difficulty_score: 3,
    };

    const pattern_b = {
      pattern_id: 'B001',
      occurrence_frequency_score: 7,
      impact_score: 5,
      response_difficulty_score: 2,
    };

    const pattern_c = {
      pattern_id: 'C001',
      occurrence_frequency_score: 6,
      impact_score: 7,
      response_difficulty_score: 4,
    };

    const patterns = [pattern_a, pattern_b, pattern_c];

    const result = calculateImprovementPriority(patterns);

    const expected_score = (8 * 0.4 + 6 * 0.4 - 3 * 0.2);

    expect(result.length).toBe(3);

    expect(result[0]).toEqual({
      pattern_id: 'A001',
      priority_score: expected_score,
      priority_rank: expected_score,
    });

    expect(result[1]).toEqual({
      pattern_id: 'B001',
      priority_score: expected_score,
      priority_rank: expected_score,
    });

    expect(result[2]).toEqual({
      pattern_id: 'C001',
      priority_score: expected_score,
      priority_rank: expected_score,
    });

    const all_same_score = result.every(r => r.priority_score === expected_score);
    expect(all_same_score).toBe(true);

    const all_same_rank = result.every(r => r.priority_rank === expected_score);
    expect(all_same_rank).toBe(true);

    const unique_ids = new Set(result.map(r => r.pattern_id));
    expect(unique_ids.size).toBe(3);
    expect(unique_ids.has('A001')).toBe(true);
    expect(unique_ids.has('B001')).toBe(true);
    expect(unique_ids.has('C001')).toBe(true);
  });
});