import { explainRecommendationReasoning } from '../../src/logic/it-1-br-3-2-1-1';

describe('AIエージェント推奨内容の根拠表示機能', () => {
  // SCEN-1148
  test('複数の過去成功パターンがマッチしたとき、複合根拠を説明に含める', () => {
    const matched_patterns = [
      {
        pattern_id: 'SUCCESS_PATTERN_001',
        customer_scale: 'mid_market_enterprise',
        success_factors: [
          'customer_scale_mid_market',
          'implementation_period_within_3months',
        ],
        match_score: 0.92,
      },
      {
        pattern_id: 'SUCCESS_PATTERN_002',
        industry_type: 'it_company',
        success_factors: [
          'industry_it_company',
          'budget_already_decided',
        ],
        match_score: 0.88,
      },
      {
        pattern_id: 'SUCCESS_PATTERN_003',
        decision_maker_role: 'cto',
        success_factors: [
          'decision_maker_cto',
          'rfp_issued',
        ],
        match_score: 0.85,
      },
    ];

    const recommendation_context = {
      target_customer_id: 'CUST_20240115_001',
      current_industry: 'it_company',
      current_scale: 'mid_market_enterprise',
      current_decision_maker_role: 'cto',
      proposed_product: 'enterprise_platform_solution',
    };

    const explanation_result = explainRecommendationReasoning(
      matched_patterns,
      recommendation_context
    );

    expect(explanation_result.explanation_text).toMatch(/過去3件の成功事例から/);

    expect(explanation_result.explanation_text).toMatch(
      /顧客規模が中堅企業/
    );
    expect(explanation_result.explanation_text).toMatch(
      /導入期間が3ヶ月以内/
    );
    expect(explanation_result.explanation_text).toMatch(/業種がIT企業/);
    expect(explanation_result.explanation_text).toMatch(/予算枠が決定済み/);
    expect(explanation_result.explanation_text).toMatch(/決裁者が技術責任者/);
    expect(explanation_result.explanation_text).toMatch(/RFP発行済み/);

    expect(explanation_result.explanation_text).toMatch(
      /いずれのケースでも決裁者が技術責任者であることが共通/
    );

    expect(explanation_result.common_success_factors).toContain(
      'decision_maker_cto'
    );
    expect(explanation_result.common_success_factors.length).toBeGreaterThan(0);

    expect(explanation_result.differentiation_guidance).toBeDefined();
    expect(explanation_result.differentiation_guidance.length).toBeGreaterThan(
      0
    );

    expect(explanation_result.matched_pattern_count).toBe(3);

    expect(explanation_result.individual_factors).toEqual([
      ['customer_scale_mid_market', 'implementation_period_within_3months'],
      ['industry_it_company', 'budget_already_decided'],
      ['decision_maker_cto', 'rfp_issued'],
    ]);

    expect(explanation_result.confidence_score).toBeGreaterThanOrEqual(0);
    expect(explanation_result.confidence_score).toBeLessThanOrEqual(100);

    expect(typeof explanation_result.explanation_text).toBe('string');
    expect(explanation_result.explanation_text.length).toBeGreaterThan(100);
  });
});