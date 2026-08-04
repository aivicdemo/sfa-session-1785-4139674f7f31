import { generateRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン抽出と提案アプローチ推奨機能', () => {
  // SCEN-1430
  test('新規案件の顧客条件がちょうど過去成功パターンと一致するとき、適用可能と判定される', () => {
    const new_case_customer_condition = {
      industry: '製造業',
      company_size_employees: 500,
      business_issue: '生産効率化',
      budget_jpy: 5000000,
      decision_period_months: 3,
    };

    const matched_success_pattern = {
      pattern_id: 'PAT-20240115-001',
      industry: '製造業',
      company_size_employees: 500,
      business_issue: '生産効率化',
      budget_jpy: 5000000,
      decision_period_months: 3,
      success_rate: 0.85,
      recommended_approach: '初期段階でのROI試算提示',
    };

    const stub_ai_engine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn().mockReturnValue([
        {
          pattern_id: matched_success_pattern.pattern_id,
          matched_data: matched_success_pattern,
          similarity_score: 1.0,
        },
      ]),
      evaluatePatternRelevance: jest.fn().mockReturnValue({
        applicability_score: 1.0,
        is_applicable: true,
      }),
      explainRecommendationReasoning: jest.fn(),
    };

    const recommendation_result = generateRecommendation(
      new_case_customer_condition,
      stub_ai_engine
    );

    expect(recommendation_result.is_applicable).toBe(true);
    expect(recommendation_result.relevance_score).toBe(1.0);
    expect(recommendation_result.matched_pattern_id).toBe(
      'PAT-20240115-001'
    );
    expect(recommendation_result.recommended_approach).toBe(
      '初期段階でのROI試算提示'
    );
  });
});