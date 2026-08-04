import { evaluateApplicableProposalRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('推奨精度検証機能 - 適用可能提案推奨', () => {
  test('SCEN-358: 顧客条件が null のとき、適用可能提案推奨がエラーになる', () => {
    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const nullCustomerCondition = null;
    const dealContext = {
      dealId: 'DEAL-20240115-001',
      productCategory: 'Enterprise Software',
      dealStage: 'proposal',
      estimatedAmount: 500000,
    };

    expect(() => {
      evaluateApplicableProposalRecommendation(
        nullCustomerCondition,
        dealContext,
        mockAIRecommendationEngine
      );
    }).toThrow(/顧客条件/);

    expect(mockAIRecommendationEngine.generateRecommendation).not.toHaveBeenCalled();
  });
});