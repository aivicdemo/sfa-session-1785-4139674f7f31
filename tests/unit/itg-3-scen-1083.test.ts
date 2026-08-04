import { generateRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン抽出・照合機能', () => {
  // SCEN-1083
  test('新規案件の商談IDがnullのとき、推奨生成処理がエラーになる', () => {
    const newDealData = {
      dealId: null,
      customerId: 'CUST-12345',
      productCategory: 'software',
      budget: 500000,
      fiscalYear: 2024,
    };

    const mockAIEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    expect(() => generateRecommendation(newDealData, mockAIEngine)).toThrow(/商談ID/);
    expect(mockAIEngine.generateRecommendation).not.toHaveBeenCalled();
  });
});