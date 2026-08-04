import { generateRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン抽出と新規案件への適用推奨', () => {
  // SCEN-2125
  test('新規案件の顧客・商談条件が null のとき、エラーが発生する', () => {
    const mockAIEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const result = generateRecommendation(null, null, mockAIEngine);

    expect(result).toEqual({
      success: false,
      error: {
        code: 'INVALID_INPUT_PARAMS',
        message: '新規案件の顧客条件と商談条件は必須です',
        statusCode: 400,
      },
    });

    expect(mockAIEngine.generateRecommendation).not.toHaveBeenCalled();
  });
});