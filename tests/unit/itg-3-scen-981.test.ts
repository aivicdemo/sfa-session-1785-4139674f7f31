import { findSimilarPatternsForNewDeal } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン抽出・照合機能', () => {
  // SCEN-981
  test('顧客情報が空オブジェクトのとき、照合処理が開始されず警告が返される', () => {
    const newDealInput = {
      customerInfo: {},
      dealConditions: {
        industryType: 'manufacturing',
        companySize: 'large',
        budget: 5000000,
        timeline: '2024-Q2'
      }
    };

    const mockAIEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn()
    };

    const result = findSimilarPatternsForNewDeal(newDealInput, mockAIEngine);

    expect(result).toEqual({
      code: 'INVALID_CUSTOMER_INFO',
      message: '顧客情報が未入力です。照合処理を開始できません',
      severity: 'warning'
    });

    expect(mockAIEngine.findSimilarPatterns).not.toHaveBeenCalled();
    expect(mockAIEngine.generateRecommendation).not.toHaveBeenCalled();
    expect(mockAIEngine.explainRecommendationReasoning).not.toHaveBeenCalled();
    expect(mockAIEngine.evaluatePatternRelevance).not.toHaveBeenCalled();
  });
});