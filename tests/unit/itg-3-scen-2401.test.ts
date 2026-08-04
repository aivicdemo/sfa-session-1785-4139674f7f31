import { evaluateInferenceAccuracy } from '../../src/logic/it-1-br-3-3-2-1';

describe('推論精度スコア算出機能', () => {
  // SCEN-2401
  test('新規案件の商談条件がnullのとき、エラーが発生する', () => {
    const mockAIEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const newDeal = {
      dealId: 'DEAL-001',
      customerId: 'CUST-001',
      dealConditions: null,
      customerIndustry: 'IT',
      dealAmount: 500000,
    };

    expect(() =>
      evaluateInferenceAccuracy(newDeal, mockAIEngine)
    ).toThrow(/dealConditions|商談条件/);

    expect(mockAIEngine.generateRecommendation).not.toHaveBeenCalled();
    expect(mockAIEngine.findSimilarPatterns).not.toHaveBeenCalled();
    expect(mockAIEngine.explainRecommendationReasoning).not.toHaveBeenCalled();
    expect(mockAIEngine.evaluatePatternRelevance).not.toHaveBeenCalled();
  });
});