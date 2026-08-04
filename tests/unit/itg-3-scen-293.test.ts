import { evaluatePatternRelevance } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン適用可能性評価機能', () => {
  // SCEN-293
  test('複数件の抽出成功パターンについて、すべてのパターンに対して適用可能性スコアが算出される', () => {
    const business_case_input = {
      customer_industry: '金融',
      budget_amount_million_yen: 1000,
      implementation_period_months: 3,
    };

    const similar_patterns = [
      {
        pattern_id: 'P001',
        customer_industry: '金融',
        budget_amount_million_yen: 900,
        implementation_period_months: 3,
        success_indicator: 0.95,
      },
      {
        pattern_id: 'P002',
        customer_industry: '金融',
        budget_amount_million_yen: 1200,
        implementation_period_months: 4,
        success_indicator: 0.88,
      },
      {
        pattern_id: 'P003',
        customer_industry: '情報通信',
        budget_amount_million_yen: 800,
        implementation_period_months: 2,
        success_indicator: 0.72,
      },
    ];

    const pattern_relevance_scores = {
      P001: 0.92,
      P002: 0.78,
      P003: 0.65,
    };

    const evaluation_results = similar_patterns.map((pattern) => ({
      pattern_id: pattern.pattern_id,
      score: pattern_relevance_scores[pattern.pattern_id as keyof typeof pattern_relevance_scores],
    }));

    const result = evaluatePatternRelevance(business_case_input, similar_patterns);

    expect(result).toBeInstanceOf(Array);
    expect(result.length).toBe(3);

    expect(result[0]).toEqual({
      pattern_id: 'P001',
      score: 0.92,
    });
    expect(result[1]).toEqual({
      pattern_id: 'P002',
      score: 0.78,
    });
    expect(result[2]).toEqual({
      pattern_id: 'P003',
      score: 0.65,
    });

    result.forEach((evaluation_result) => {
      expect(evaluation_result.score).toBeGreaterThanOrEqual(0);
      expect(evaluation_result.score).toBeLessThanOrEqual(1);
      expect(evaluation_result).toHaveProperty('pattern_id');
      expect(evaluation_result).toHaveProperty('score');
    });
  });
});