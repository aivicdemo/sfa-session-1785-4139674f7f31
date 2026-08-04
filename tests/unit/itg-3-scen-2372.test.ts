import { calculateRecommendationPrecisionScore } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェント推論精度スコア算出機能', () => {
  // SCEN-2372
  test('複数の推論根拠から加重平均で精度スコアを算出する', () => {
    const reasoning_basis_1 = {
      relevance_score: 0.92,
      pattern_id: 'pattern_001',
    };
    const reasoning_basis_2 = {
      relevance_score: 0.85,
      pattern_id: 'pattern_002',
    };
    const reasoning_basis_3 = {
      relevance_score: 0.78,
      pattern_id: 'pattern_003',
    };

    const mock_ai_engine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn().mockResolvedValue([
        reasoning_basis_1,
        reasoning_basis_2,
        reasoning_basis_3,
      ]),
    };

    const deal_conditions = {
      customer_industry: 'IT',
      budget_scale: 5000000,
      issue_content: 'Digital transformation',
    };

    const result = calculateRecommendationPrecisionScore(
      deal_conditions,
      mock_ai_engine
    );

    expect(result.precision_score).toBe(0.85);
    expect(result.reasoning_basis).toHaveLength(3);
    expect(result.reasoning_basis[0]).toEqual({
      pattern_id: 'pattern_001',
      individual_relevance_score: 0.92,
      weight_coefficient: 0.4,
    });
    expect(result.reasoning_basis[1]).toEqual({
      pattern_id: 'pattern_002',
      individual_relevance_score: 0.85,
      weight_coefficient: 0.35,
    });
    expect(result.reasoning_basis[2]).toEqual({
      pattern_id: 'pattern_003',
      individual_relevance_score: 0.78,
      weight_coefficient: 0.25,
    });
  });
});