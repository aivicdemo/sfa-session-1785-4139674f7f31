import { generateRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('推奨精度検証機能 - 商談条件null入力時のエラーハンドリング', () => {
  test('SCEN-359: 商談条件がnullのとき、適用可能提案推奨がエラーになる', () => {
    const mockAIEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const mockResult = generateRecommendation(null, mockAIEngine);

    expect(mockResult).toEqual({
      success: false,
      error: {
        code: 'INVALID_DEAL_CONDITION',
        message: '商談条件が入力されていません。顧客名、商品カテゴリ、予算額を指定してください',
      },
      recommendation: null,
      errorLog: expect.stringContaining('dealCondition=null'),
    });

    expect(mockAIEngine.generateRecommendation).not.toHaveBeenCalled();
  });
});