import { validateProposalConstraintAlignment } from '../../src/logic/it-1-br-3-2-1-1';

describe('AIエージェント推奨内容の根拠表示機能', () => {
  // SCEN-1361
  test('提案内容と顧客制約条件の自動照合機能 - 営業管理職の権限がないとき照合処理がエラーになる', () => {
    const salesRepresentativeUser = {
      userId: 'user_001',
      userRole: 'sales_representative',
      department: 'sales'
    };

    const customerConstraints = {
      customerId: 'cust_12345',
      budgetLimit: 5000000,
      deliveryDueMonths: 3,
      productCategories: ['A', 'B'],
      purchaseFrequency: 'monthly'
    };

    const proposalContent = {
      proposalId: 'prop_98765',
      productCategory: 'A',
      estimatedBudget: 4500000,
      proposedDeliveryMonths: 2,
      items: [
        {
          itemId: 'item_001',
          itemName: 'Service A',
          price: 4500000
        }
      ]
    };

    const mockAIEngine = {
      evaluatePatternRelevance: jest.fn().mockResolvedValue({
        relevanceScore: 85,
        applicablePatterns: []
      })
    };

    const systemLogger = {
      logAuthorizationFailure: jest.fn()
    };

    expect(() => {
      validateProposalConstraintAlignment(
        salesRepresentativeUser,
        proposalContent,
        customerConstraints,
        mockAIEngine,
        systemLogger
      );
    }).toThrow(/権限/);

    expect(mockAIEngine.evaluatePatternRelevance).not.toHaveBeenCalled();
    expect(systemLogger.logAuthorizationFailure).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: 'user_001',
        attemptedOperation: 'proposal_constraint_alignment_validation'
      })
    );
  });
});