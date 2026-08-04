import { aggregateRecommendationPatterns } from '../../src/logic/it-1-br-3-3-2-1';

describe('推奨パターンマスタの統計集計機能', () => {
  // SCEN-318
  test('推奨パターンマスタが複数件のとき、出現頻度に基づいて上位パターンが集計される', () => {
    const recommendation_patterns = [
      {
        pattern_id: 'pattern_a',
        pattern_name: 'パターンA',
        occurrence_count: 45,
      },
      {
        pattern_id: 'pattern_b',
        pattern_name: 'パターンB',
        occurrence_count: 32,
      },
      {
        pattern_id: 'pattern_c',
        pattern_name: 'パターンC',
        occurrence_count: 28,
      },
      {
        pattern_id: 'pattern_d',
        pattern_name: 'パターンD',
        occurrence_count: 15,
      },
      {
        pattern_id: 'pattern_e',
        pattern_name: 'パターンE',
        occurrence_count: 8,
      },
    ];

    const result = aggregateRecommendationPatterns(
      recommendation_patterns,
      3
    );

    expect(result).toEqual([
      {
        pattern_id: 'pattern_a',
        pattern_name: 'パターンA',
        occurrence_count: 45,
        rank: 1,
      },
      {
        pattern_id: 'pattern_b',
        pattern_name: 'パターンB',
        occurrence_count: 32,
        rank: 2,
      },
      {
        pattern_id: 'pattern_c',
        pattern_name: 'パターンC',
        occurrence_count: 28,
        rank: 3,
      },
    ]);
    expect(result.length).toBe(3);
    expect(result[0].occurrence_count).toBe(45);
    expect(result[1].occurrence_count).toBe(32);
    expect(result[2].occurrence_count).toBe(28);
  });
});