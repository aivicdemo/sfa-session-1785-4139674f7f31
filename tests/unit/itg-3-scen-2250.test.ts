import { findSimilarPatterns, evaluatePatternRelevance, generateRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('提案アプローチマッチング機能', () => {
  // SCEN-2250
  test('新規案件の顧客・商談条件が過去成功パターンの条件と部分的に合致する場合、適用可能な提案アプローチと根拠を推奨する', () => {
    const new_deal_input = {
      customer_industry: '製造業',
      deal_size_jpy: 5000000,
      business_challenge: '生産効率化',
      decision_maker_count: 3
    };

    const past_success_patterns = [
      {
        pattern_id: 'pattern_001',
        customer_industry: '製造業',
        deal_size_min_jpy: 3000000,
        deal_size_max_jpy: 7000000,
        business_challenge: '業務自動化',
        decision_maker_count_min: 2,
        decision_maker_count_max: 4,
        success_count: 26
      },
      {
        pattern_id: 'pattern_002',
        customer_industry: '製造業',
        deal_size_min_jpy: 3000000,
        deal_size_max_jpy: 7000000,
        business_challenge: '業務自動化',
        decision_maker_count_min: 2,
        decision_maker_count_max: 4,
        success_count: 18
      },
      {
        pattern_id: 'pattern_003',
        customer_industry: '製造業',
        deal_size_min_jpy: 3000000,
        deal_size_max_jpy: 7000000,
        business_challenge: '業務自動化',
        decision_maker_count_min: 2,
        decision_maker_count_max: 4,
        success_count: 15
      }
    ];

    const stub_ai_engine = {
      findSimilarPatterns: jest.fn().mockReturnValue([
        {
          pattern_id: 'pattern_001',
          similarity_score: 0.72,
          matched_attributes: ['industry', 'size_range', 'decision_makers']
        },
        {
          pattern_id: 'pattern_002',
          similarity_score: 0.68,
          matched_attributes: ['industry', 'size_range', 'decision_makers']
        },
        {
          pattern_id: 'pattern_003',
          similarity_score: 0.55,
          matched_attributes: ['industry', 'size_range']
        }
      ]),
      evaluatePatternRelevance: jest.fn().mockReturnValue({
        applicability_score: 0.70,
        is_applicable: true,
        constraint_violations: []
      }),
      generateRecommendation: jest.fn().mockReturnValue({
        recommended_approach: '段階的な導入アプローチ+経営層向けROI説明資料',
        rationale: '同規模・同課題での成功率78%',
        confidence_score: 78,
        key_success_factors: ['段階的導入', 'ROI最適化', '経営層説得']
      })
    };

    const recommendation_result = generateRecommendation(
      new_deal_input,
      past_success_patterns,
      stub_ai_engine
    );

    expect(recommendation_result.recommended_approach).toBe('段階的な導入アプローチ+経営層向けROI説明資料');
    expect(recommendation_result.confidence_score).toBe(78);

    const similar_patterns = findSimilarPatterns(
      new_deal_input,
      past_success_patterns,
      stub_ai_engine
    );

    expect(similar_patterns).toHaveLength(3);
    expect(similar_patterns[0].similarity_score).toBe(0.72);
    expect(similar_patterns[1].similarity_score).toBe(0.68);
    expect(similar_patterns[2].similarity_score).toBe(0.55);

    const relevance_result = evaluatePatternRelevance(
      new_deal_input,
      similar_patterns,
      stub_ai_engine
    );

    expect(relevance_result.applicability_score).toBe(0.70);
    expect(relevance_result.is_applicable).toBe(true);

    const formatted_explanation = {
      base_rationale: recommendation_result.rationale,
      pattern_count: similar_patterns.length,
      applicability_score_pct: Math.round(relevance_result.applicability_score * 100),
      match_breakdown: {
        industry_matched: true,
        size_match_rate_pct: 72,
        challenge_match_rate_pct: 68,
        decision_maker_match_rate_pct: 55
      },
      ranked_patterns_by_score: similar_patterns.map(p => ({
        id: p.pattern_id,
        score: p.similarity_score
      }))
    };

    expect(formatted_explanation.base_rationale).toBe('同規模・同課題での成功率78%');
    expect(formatted_explanation.pattern_count).toBe(3);
    expect(formatted_explanation.applicability_score_pct).toBe(70);
    expect(formatted_explanation.match_breakdown.industry_matched).toBe(true);
    expect(formatted_explanation.match_breakdown.size_match_rate_pct).toBe(72);
    expect(formatted_explanation.match_breakdown.challenge_match_rate_pct).toBe(68);
    expect(formatted_explanation.match_breakdown.decision_maker_match_rate_pct).toBe(55);
    expect(formatted_explanation.ranked_patterns_by_score).toEqual([
      { id: 'pattern_001', score: 0.72 },
      { id: 'pattern_002', score: 0.68 },
      { id: 'pattern_003', score: 0.55 }
    ]);
  });
});