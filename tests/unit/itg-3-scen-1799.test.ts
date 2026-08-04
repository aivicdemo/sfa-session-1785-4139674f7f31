import { generateRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('提案アプローチ推奨機能', () => {
  // SCEN-1799
  test('顧客制約条件を満たす提案アプローチのみが推奨される', async () => {
    const customer_constraint = {
      budget_upper_limit: 5000000,
      implementation_period_days: 90,
      restricted_solution_categories: ['特定業界向けソリューション']
    };

    const new_deal_data = {
      customer_id: 'CUST-001',
      customer_industry: '製造業',
      customer_scale: '中規模',
      constraints: customer_constraint
    };

    const mock_recommendation_engine = {
      generateRecommendation: jest.fn().mockResolvedValue([
        {
          recommendation_id: 'REC-A',
          approach_name: '推奨A',
          required_budget: 6000000,
          required_implementation_days: 60,
          solution_category: '標準ソリューション',
          confidence_score: 85
        },
        {
          recommendation_id: 'REC-B',
          approach_name: '推奨B',
          required_budget: 4000000,
          required_implementation_days: 60,
          solution_category: '標準ソリューション',
          confidence_score: 92
        },
        {
          recommendation_id: 'REC-C',
          approach_name: '推奨C',
          required_budget: 5000000,
          required_implementation_days: 120,
          solution_category: '標準ソリューション',
          confidence_score: 78
        },
        {
          recommendation_id: 'REC-D',
          approach_name: '推奨D',
          required_budget: 3000000,
          required_implementation_days: 90,
          solution_category: '標準ソリューション',
          confidence_score: 88
        }
      ]),
      findSimilarPatterns: jest.fn().mockResolvedValue([]),
      explainRecommendationReasoning: jest.fn().mockResolvedValue(''),
      evaluatePatternRelevance: jest.fn().mockResolvedValue(0)
    };

    const filtered_recommendations = await generateRecommendation(
      new_deal_data,
      mock_recommendation_engine
    );

    expect(filtered_recommendations).toHaveLength(2);

    const recommendation_ids = filtered_recommendations.map(
      (rec) => rec.recommendation_id
    );
    expect(recommendation_ids).toContain('REC-B');
    expect(recommendation_ids).toContain('REC-D');

    for (const recommendation of filtered_recommendations) {
      expect(recommendation.required_budget).toBeLessThanOrEqual(
        customer_constraint.budget_upper_limit
      );
      expect(recommendation.required_implementation_days).toBeLessThanOrEqual(
        customer_constraint.implementation_period_days
      );
      expect(
        customer_constraint.restricted_solution_categories
      ).not.toContain(recommendation.solution_category);
    }

    const rec_b = filtered_recommendations.find(
      (rec) => rec.recommendation_id === 'REC-B'
    );
    expect(rec_b).toBeDefined();
    expect(rec_b?.required_budget).toBe(4000000);
    expect(rec_b?.required_implementation_days).toBe(60);

    const rec_d = filtered_recommendations.find(
      (rec) => rec.recommendation_id === 'REC-D'
    );
    expect(rec_d).toBeDefined();
    expect(rec_d?.required_budget).toBe(3000000);
    expect(rec_d?.required_implementation_days).toBe(90);
  });
});