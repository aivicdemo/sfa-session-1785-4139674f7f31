import { calculateRecommendationScore } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-1653
  test('推奨スコア算出機能 - 顧客IDが null のとき、エラーが発生する', () => {
    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const input = {
      customerId: null,
      dealId: 'DEAL-12345',
      customerAttribute: { industry: 'IT', employeeCount: 100 },
      dealCondition: { productCategory: 'Software', estimatedAmount: 500000 },
    };

    expect(() =>
      calculateRecommendationScore(input, mockAIRecommendationEngine)
    ).toThrow(/顧客IDは必須です/);

    expect(mockAIRecommendationEngine.generateRecommendation).not.toHaveBeenCalled();
    expect(mockAIRecommendationEngine.findSimilarPatterns).not.toHaveBeenCalled();
    expect(mockAIRecommendationEngine.explainRecommendationReasoning).not.toHaveBeenCalled();
    expect(mockAIRecommendationEngine.evaluatePatternRelevance).not.toHaveBeenCalled();
  });
});