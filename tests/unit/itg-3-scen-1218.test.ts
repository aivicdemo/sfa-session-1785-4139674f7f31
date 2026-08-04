import { validateProposalFeasibility } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-1218
  test('リスク要因が空文字列のとき、エラーを返す', () => {
    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const input = {
      customerId: 'CUST-001',
      dealConditions: {
        industry: '製造業',
        companySize: 'large',
        budget: 5000000,
      },
      proposalContent: {
        productName: 'エンタープライズERP',
        implementationPeriod: 6,
        totalCost: 4500000,
      },
      riskFactors: '',
    };

    expect(() => {
      validateProposalFeasibility(input, mockAIRecommendationEngine);
    }).toThrow(/リスク要因/);

    expect(mockAIRecommendationEngine.generateRecommendation).not.toHaveBeenCalled();
    expect(mockAIRecommendationEngine.findSimilarPatterns).not.toHaveBeenCalled();
    expect(mockAIRecommendationEngine.explainRecommendationReasoning).not.toHaveBeenCalled();
    expect(mockAIRecommendationEngine.evaluatePatternRelevance).not.toHaveBeenCalled();
  });
});