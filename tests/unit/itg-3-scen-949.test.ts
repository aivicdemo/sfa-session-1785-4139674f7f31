import { generateRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('提案アプローチ推奨生成機能', () => {
  test('SCEN-949: 顧客情報が空オブジェクトのとき、推奨生成処理が開始されず警告が返される', () => {
    const emptyCustomerInfo = {};
    const mockAIEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const result = generateRecommendation(emptyCustomerInfo, mockAIEngine);

    expect(result).toEqual({
      status: 'warning',
      code: 'INVALID_CUSTOMER_INFO',
      message: '顧客情報が不足しています。推奨の生成に必要な顧客情報（企業名、業種、課題など）を入力してください。',
      recommendationId: null,
      fallbackRecommendation: null,
    });

    expect(mockAIEngine.generateRecommendation).not.toHaveBeenCalled();
    expect(mockAIEngine.findSimilarPatterns).not.toHaveBeenCalled();
    expect(mockAIEngine.explainRecommendationReasoning).not.toHaveBeenCalled();
    expect(mockAIEngine.evaluatePatternRelevance).not.toHaveBeenCalled();
  });
});