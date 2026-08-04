import { validateAgainstCustomerConstraints } from '../../src/logic/it-1-br-3-3-2-1';

describe('Constraint Validation Service - Customer Purchase Limit Edge Case', () => {
  // SCEN-1172
  test('should mark proposal as not applicable when total amount equals customer purchase limit', () => {
    const customerConstraint = {
      customerId: 'CUST001',
      purchaseLimitAmount: 100000,
      currency: 'JPY',
    };

    const proposal = {
      proposalId: 'PROP001',
      totalAmount: 100000,
      currency: 'JPY',
      items: [
        {
          itemId: 'ITEM001',
          quantity: 1,
          unitPrice: 100000,
        },
      ],
    };

    const aiRecommendationEngineStub = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const result = validateAgainstCustomerConstraints(
      proposal,
      customerConstraint,
      aiRecommendationEngineStub
    );

    expect(result.isApplicable).toBe(false);
    expect(result.reasonCode).toBe('EXCEEDS_PURCHASE_LIMIT_EQUAL_OR_OVER');
    expect(result.errorMessage).toContain('提案の合計金額100,000円が顧客の購入上限100,000円以上となるため、この提案は適用できません');
  });
});