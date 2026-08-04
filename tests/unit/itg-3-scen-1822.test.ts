import { findSimilarPatterns } from '../../src/logic/it-1-br-3-3-2-1';

describe('過去商談データから成功パターンを抽出し、新規案件の顧客・商談条件と照合して適用可能な提案アプローチを自動推奨する機能', () => {
  // SCEN-1822
  test('[normal] 類似パターン検索機能 - 検索結果が類似度スコアで降順にランク付けされる', async () => {
    const deal_conditions = {
      industry: 'IT',
      budget_min: 5000000,
      decision_makers: 3,
    };

    const mock_similar_patterns = [
      {
        pattern_id: 'pattern_a',
        similarity_score: 0.95,
        pattern_name: 'Enterprise IT Solution',
        success_count: 12,
      },
      {
        pattern_id: 'pattern_b',
        similarity_score: 0.87,
        pattern_name: 'Mid-Market IT Strategy',
        success_count: 8,
      },
      {
        pattern_id: 'pattern_c',
        similarity_score: 0.72,
        pattern_name: 'IT Infrastructure Setup',
        success_count: 5,
      },
      {
        pattern_id: 'pattern_d',
        similarity_score: 0.65,
        pattern_name: 'Cloud Migration Support',
        success_count: 3,
      },
      {
        pattern_id: 'pattern_e',
        similarity_score: 0.58,
        pattern_name: 'Tech Consulting Basic',
        success_count: 2,
      },
    ];

    const mock_ai_engine = {
      findSimilarPatterns: jest.fn().mockResolvedValue(mock_similar_patterns),
    };

    const search_result = await findSimilarPatterns(deal_conditions, mock_ai_engine);

    expect(search_result).toHaveLength(5);
    expect(search_result[0].similarity_score).toBe(0.95);
    expect(search_result[1].similarity_score).toBe(0.87);
    expect(search_result[2].similarity_score).toBe(0.72);
    expect(search_result[3].similarity_score).toBe(0.65);
    expect(search_result[4].similarity_score).toBe(0.58);

    const scores = search_result.map((p) => p.similarity_score);
    expect(scores).toEqual([0.95, 0.87, 0.72, 0.65, 0.58]);

    for (let i = 0; i < scores.length - 1; i++) {
      expect(scores[i]).toBeGreaterThan(scores[i + 1]);
    }
  });
});