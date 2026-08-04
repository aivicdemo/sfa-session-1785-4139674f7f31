import { generateProposalApproachRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('提案アプローチ推奨生成機能', () => {
  // SCEN-954
  test('商談IDが未設定のとき、推奨生成処理が開始されず警告が返される', () => {
    const mockAIEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const requestWithNullDealId = {
      dealId: null,
      customerAttributes: {
        industry: '製造業',
        scale: '中堅企業',
      },
      dealConditions: {
        productCategory: 'システム構築',
        budgetRange: '5000万円～1億円',
      },
    };

    const result = generateProposalApproachRecommendation(
      requestWithNullDealId,
      mockAIEngine
    );

    expect(mockAIEngine.generateRecommendation).not.toHaveBeenCalled();
    expect(result.warning).toBeDefined();
    expect(result.warning.code).toBe('DEAL_ID_MISSING');
    expect(result.warning.message).toBe(
      '商談IDが設定されていません。推奨生成を開始してください'
    );
    expect(result.recommendation).toEqual(null);
    expect(result.reasoning).toBe('');
    expect(result.statusCode).toBe(400);
  });
});