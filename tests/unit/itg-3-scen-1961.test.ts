import { generateRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン抽出・照合機能', () => {
  // SCEN-1961
  test('同じ条件で2回実行したときに同じ推奨パターンが返却される', () => {
    const customer_condition = {
      industry: 'SaaS',
      challenge: 'cost_reduction',
      budget_amount: 5000000,
      decision_maker: 'IT_director',
    };

    const mock_engine = {
      generateRecommendation: jest.fn(() => ({
        recommendation_pattern_id: 'PAT-2024-001',
        recommendation_approach: 'phased_adoption_proposal',
        confidence_score: 0.92,
        referenced_success_cases: [
          { case_id: 'CASE-2023-045', similarity_score: 0.95 },
          { case_id: 'CASE-2023-067', similarity_score: 0.88 },
        ],
        evaluation_rationale:
          'Similar customer profile with successful phased adoption pattern',
        ranking_position: 1,
        generated_timestamp: '2024-01-15T10:30:00Z',
      })),
    };

    const first_result = generateRecommendation(
      customer_condition,
      mock_engine
    );

    const second_result = generateRecommendation(
      customer_condition,
      mock_engine
    );

    expect(first_result.recommendation_pattern_id).toBe('PAT-2024-001');
    expect(second_result.recommendation_pattern_id).toBe('PAT-2024-001');

    expect(first_result.recommendation_approach).toBe(
      'phased_adoption_proposal'
    );
    expect(second_result.recommendation_approach).toBe(
      'phased_adoption_proposal'
    );

    expect(first_result.confidence_score).toBe(0.92);
    expect(second_result.confidence_score).toBe(0.92);

    expect(first_result.referenced_success_cases).toEqual([
      { case_id: 'CASE-2023-045', similarity_score: 0.95 },
      { case_id: 'CASE-2023-067', similarity_score: 0.88 },
    ]);
    expect(second_result.referenced_success_cases).toEqual([
      { case_id: 'CASE-2023-045', similarity_score: 0.95 },
      { case_id: 'CASE-2023-067', similarity_score: 0.88 },
    ]);

    expect(first_result.evaluation_rationale).toBe(
      'Similar customer profile with successful phased adoption pattern'
    );
    expect(second_result.evaluation_rationale).toBe(
      'Similar customer profile with successful phased adoption pattern'
    );

    expect(first_result.ranking_position).toBe(1);
    expect(second_result.ranking_position).toBe(1);

    expect(first_result).toEqual(second_result);
  });
});