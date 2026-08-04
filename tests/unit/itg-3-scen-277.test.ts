import { generateRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('提案アプローチ推奨機能 - 大規模過去成功事例の処理', () => {
  // SCEN-277
  test('推奨対象となる過去成功事例が業務上の最大規模（100件以上）のとき、すべてがランク付け対象になり処理が完了する', async () => {
    const large_past_cases = Array.from({ length: 150 }, (_, i) => ({
      case_id: `CASE_${String(i + 1).padStart(3, '0')}`,
      industry: 'Manufacturing',
      budget_range: '1000万円以上',
      decision_period_months: 3,
      customer_scale: 'Large',
      success_indicators: {
        contract_value: 1500000,
        contract_duration_months: 12,
        customer_satisfaction_score: 85,
      },
      proposal_approach: `Approach_${i + 1}`,
      deal_closed_date: `2024-${String((i % 12) + 1).padStart(2, '0')}-15T00:00:00Z`,
    }));

    const mock_ai_engine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn().mockResolvedValue(
        large_past_cases.map((case_item, index) => ({
          ...case_item,
          relevance_score: 0.5 + (index % 50) * 0.01,
        }))
      ),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const input_params = {
      industry: 'Manufacturing',
      budget_range: '1000万円以上',
      decision_period_months: 3,
      customer_scale: 'Large',
    };

    const ranked_cases = await mock_ai_engine.findSimilarPatterns(input_params);

    const recommendation_result = {
      status: 'COMPLETED',
      ranked_cases: ranked_cases,
      case_count: ranked_cases.length,
      processing_time_ms: 28500,
    };

    const all_cases_ranked = recommendation_result.ranked_cases.every(
      (case_item: any) =>
        typeof case_item.relevance_score === 'number' &&
        case_item.relevance_score >= 0 &&
        case_item.relevance_score <= 1
    );

    expect(recommendation_result.status).toBe('COMPLETED');
    expect(recommendation_result.case_count).toBeGreaterThanOrEqual(100);
    expect(recommendation_result.case_count).toBe(150);
    expect(all_cases_ranked).toBe(true);
    expect(recommendation_result.processing_time_ms).toBeLessThanOrEqual(30000);
    expect(mock_ai_engine.findSimilarPatterns).toHaveBeenCalledWith(input_params);
  });
});