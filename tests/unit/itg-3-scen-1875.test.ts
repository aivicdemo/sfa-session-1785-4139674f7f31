import { generateRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン抽出・照合・推奨機能', () => {
  // SCEN-1875
  test('新規案件の顧客IDが null のとき照合に失敗する', () => {
    const newDeal = {
      customerId: null,
      dealCondition: {
        industryType: 'manufacturing',
        companySize: 'large',
        budget: 5000000,
        timeline: '2024-Q2'
      },
      proposalContent: {
        productCategory: 'enterprise-solution',
        estimatedValue: 4500000,
        implementationDays: 60
      }
    };

    const mockAIEngine = {
      findSimilarPatterns: jest.fn(),
      generateRecommendation: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn()
    };

    expect(() =>
      generateRecommendation(newDeal, mockAIEngine)
    ).toThrow(/customerId/);

    expect(mockAIEngine.findSimilarPatterns).not.toHaveBeenCalled();
    expect(mockAIEngine.generateRecommendation).not.toHaveBeenCalled();
  });
});