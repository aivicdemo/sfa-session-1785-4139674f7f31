import { generateRecommendation, explainRecommendationReasoning } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-1911
  test('[edge] 推奨根拠の可視化機能 - 過去事例の日付が期間開始日より直前のときに根拠から除外される', () => {
    const period_start_date = new Date('2024-01-15T00:00:00Z');
    const period_end_date = new Date('2024-12-31T23:59:59Z');

    const past_case_a = {
      case_id: 'CASE_A',
      case_date: new Date('2024-01-14T00:00:00Z'),
      customer_industry: 'Manufacturing',
      customer_size: 'Large',
      proposal_approach: 'Value-based pricing',
      success_indicator: true,
      similarity_score: 0.85,
    };

    const past_case_b = {
      case_id: 'CASE_B',
      case_date: new Date('2024-01-08T00:00:00Z'),
      customer_industry: 'Manufacturing',
      customer_size: 'Large',
      proposal_approach: 'Value-based pricing',
      success_indicator: true,
      similarity_score: 0.82,
    };

    const past_case_c = {
      case_id: 'CASE_C',
      case_date: new Date('2024-01-15T00:00:00Z'),
      customer_industry: 'Manufacturing',
      customer_size: 'Large',
      proposal_approach: 'Value-based pricing',
      success_indicator: true,
      similarity_score: 0.80,
    };

    const new_case_input = {
      customer_industry: 'Manufacturing',
      customer_size: 'Large',
      annual_revenue: 500000000,
      current_challenges: ['Cost optimization', 'Process efficiency'],
      budget_range_min: 50000,
      budget_range_max: 500000,
      decision_timeline_days: 90,
    };

    const ai_engine_stub = {
      generateRecommendation: jest.fn().mockReturnValue({
        recommended_approach: 'Value-based pricing',
        confidence_score: 87,
        estimated_success_rate: 0.87,
        key_success_factors: ['Industry match', 'Budget alignment', 'Timeline fit'],
        similar_cases: [past_case_a, past_case_b, past_case_c],
      }),
      findSimilarPatterns: jest.fn().mockReturnValue([past_case_a, past_case_b, past_case_c]),
      explainRecommendationReasoning: jest.fn().mockImplementation((recommendation) => {
        const filtered_cases = recommendation.similar_cases.filter(
          (case_item: any) => case_item.case_date >= period_start_date
        );

        return {
          explanation_text:
            'Based on similar successful cases from the past 12 months, we recommend a value-based pricing approach. ' +
            'This approach has shown a success rate of 87% for similar customers in the manufacturing industry.',
          supporting_cases: filtered_cases,
          confidence_reason: 'The recommendation is based on 2 similar successful cases within the evaluation period.',
          risk_factors: ['Market volatility', 'Competing vendor presence'],
        };
      }),
      evaluatePatternRelevance: jest.fn().mockReturnValue(0.85),
    };

    const recommendation_result = generateRecommendation(new_case_input, ai_engine_stub);

    expect(recommendation_result.recommended_approach).toBe('Value-based pricing');
    expect(recommendation_result.confidence_score).toBe(87);
    expect(recommendation_result.similar_cases).toHaveLength(3);

    const reasoning_result = explainRecommendationReasoning(recommendation_result, ai_engine_stub);

    expect(reasoning_result.supporting_cases).toHaveLength(2);
    expect(reasoning_result.supporting_cases.map((c: any) => c.case_id)).toEqual(['CASE_B', 'CASE_C']);
    expect(reasoning_result.supporting_cases.some((c: any) => c.case_id === 'CASE_A')).toBe(false);

    reasoning_result.supporting_cases.forEach((case_item: any) => {
      expect(case_item.case_date.getTime()).toBeGreaterThanOrEqual(period_start_date.getTime());
    });

    expect(reasoning_result.confidence_reason).toContain('2 similar successful cases');
  });
});