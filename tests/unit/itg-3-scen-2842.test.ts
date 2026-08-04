import { generateRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン抽出・提案アプローチ推奨機能', () => {
  // SCEN-2842
  test('新規案件の商談条件が過去成功パターンと一致した場合、適用可能スコアが高く算出される', () => {
    const past_success_pattern = {
      industry: 'SaaS',
      company_size: 'mid_market',
      budget_range_lower: 5000000,
      budget_range_upper: 10000000,
      decision_speed_days: 90,
      success_rate: 0.85,
    };

    const new_deal_condition = {
      industry: 'SaaS',
      company_size: 'mid_market',
      budget_amount: 5000000,
      decision_speed_days: 75,
      customer_challenge: 'business_efficiency',
    };

    const mock_ai_engine = {
      generateRecommendation: jest.fn().mockReturnValue({
        recommended_approach: 'Implement efficiency-first positioning',
        applicability_score: 0.82,
        supporting_patterns: [
          {
            pattern_id: 'pat_001',
            match_reason: 'Industry and company size aligned with 85% success case',
            confidence: 0.88,
          },
        ],
      }),
      findSimilarPatterns: jest.fn().mockReturnValue([]),
      explainRecommendationReasoning: jest.fn().mockReturnValue(''),
      evaluatePatternRelevance: jest
        .fn()
        .mockReturnValue({
          current_condition: new_deal_condition,
          reference_pattern: past_success_pattern,
          relevance_score: 0.82,
        }),
    };

    const result = generateRecommendation(
      new_deal_condition,
      past_success_pattern,
      mock_ai_engine
    );

    expect(mock_ai_engine.evaluatePatternRelevance).toHaveBeenCalledWith(
      new_deal_condition,
      past_success_pattern
    );

    expect(result.applicability_score).toBeGreaterThanOrEqual(0.8);
    expect(result.applicability_score).toBeLessThanOrEqual(1.0);
    expect(result.recommended_approach).toBeDefined();
    expect(typeof result.applicability_score).toBe('number');
  });
});