import { findApplicableSuccessPattern } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン抽出・照合機能', () => {
  // SCEN-980
  test('新規案件の顧客情報が null のとき、照合処理が開始されず警告が返される', () => {
    const mockAIEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const newDeal = {
      dealId: 'DEAL-20240115-001',
      customerInfo: null,
      dealConditions: {
        industry: 'manufacturing',
        companySize: 'large',
        budget: 5000000,
      },
      dealStage: 'initial_proposal',
      createdAt: new Date('2024-01-15T10:00:00Z'),
    };

    const result = findApplicableSuccessPattern(newDeal, mockAIEngine);

    expect(mockAIEngine.generateRecommendation).not.toHaveBeenCalled();
    expect(mockAIEngine.findSimilarPatterns).not.toHaveBeenCalled();
    expect(mockAIEngine.explainRecommendationReasoning).not.toHaveBeenCalled();
    expect(mockAIEngine.evaluatePatternRelevance).not.toHaveBeenCalled();

    expect(result).toEqual({
      success: false,
      warning: {
        code: 'CUSTOMER_INFO_MISSING',
        message: '顧客情報が不足しています。照合処理をスキップします',
      },
      recommendedPattern: null,
      similarPatterns: [],
      confidence: 0,
    });
  });
});