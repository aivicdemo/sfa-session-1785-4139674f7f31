import { explainRecommendationReasoning } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-2606
  test('[normal] 推奨パターンの根拠が1つの成功要因のみの場合、その要因が説明文に正確に表示される', () => {
    const mockRecommendationPattern = {
      recommendationId: 'rec-001',
      successFactors: ['顧客の予算規模が大きい'],
      proposalApproach: 'エンタープライズプランの提案',
      confidenceScore: 92,
    };

    const mockCustomerInfo = {
      industry: 'IT',
      employeeCount: 500,
      annualBudget: 1000000000,
    };

    const expectedExplanation =
      '顧客の予算規模が大きいため、エンタープライズプランの提案が効果的です';

    const result = explainRecommendationReasoning(
      mockRecommendationPattern,
      mockCustomerInfo
    );

    expect(result).toBe(expectedExplanation);
  });
});