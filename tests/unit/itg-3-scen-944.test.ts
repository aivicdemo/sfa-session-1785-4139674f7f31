import { evaluateRecommendationAgainstCustomerConstraints } from '../../src/logic/it-1-br-3-3-2-1';

describe('AIエージェント推奨支援システム - 顧客制約条件照合', () => {
  // SCEN-944
  test('推奨提案が顧客制約条件の購買制限範囲内であることを照合する', () => {
    const customerId = 'CUST-001';
    
    const customerConstraint = {
      customerId,
      maxPurchaseAmount: 5000000,
      allowedCategories: ['システム導入'],
      maxMonthlyPurchaseCount: 3,
    };

    const aiRecommendation = {
      customerId,
      proposalName: 'クラウドシステム導入サービス',
      estimatedAmount: 4500000,
      recommendedCategory: 'システム導入',
      trustScorePercent: 85,
    };

    const aiRecommendationEngineStub = {
      generateRecommendation: jest.fn().mockResolvedValue(aiRecommendation),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const newDealData = {
      customerId,
      dealCondition: 'デジタル化促進',
      industry: 'IT',
      companySize: 'large',
    };

    const result = evaluateRecommendationAgainstCustomerConstraints(
      customerId,
      customerConstraint,
      aiRecommendation,
      newDealData
    );

    expect(result.withinConstraintRange).toBe(true);
    expect(result.estimatedAmountExceedsLimit).toBe(false);
    expect(result.estimatedAmountValue).toBe(4500000);
    expect(result.maxAmountLimit).toBe(5000000);
    expect(result.categoryAllowed).toBe(true);
    expect(result.recommendedCategory).toBe('システム導入');
    expect(result.allowedCategoriesList).toEqual(['システム導入']);
  });
});