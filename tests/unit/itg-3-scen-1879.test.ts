import { generateRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン抽出・照合・推奨機能', () => {
  // SCEN-1879
  test('新規案件の商談条件が null のとき照合に失敗する', () => {
    const mockAIEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const newDeal = {
      customerId: 'CUST-001',
      dealConditions: null,
      dealName: '新規案件A',
      industry: '製造業',
      companySize: 'large',
    };

    const result = generateRecommendation(newDeal, mockAIEngine);

    expect(result).toHaveProperty('errorCode');
    expect(result.errorCode).toMatch(/INVALID_DEAL_CONDITIONS/);
    expect(result.recommendation).toBeNull();
    expect(mockAIEngine.findSimilarPatterns).not.toHaveBeenCalled();
    expect(mockAIEngine.generateRecommendation).not.toHaveBeenCalled();
    expect(mockAIEngine.evaluatePatternRelevance).not.toHaveBeenCalled();
  });
});