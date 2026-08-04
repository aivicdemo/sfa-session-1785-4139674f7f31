import { generateRecommendation } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-369
  test('改善提案生成時に現在精度が未指定の場合、エラーを返す', () => {
    const mockAIEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const input = {
      dealId: 'DEAL-12345',
      customerId: 'CUST-67890',
      currentAccuracy: null,
      targetAccuracy: 85,
      dealConditions: {
        industry: 'manufacturing',
        companySize: 'large',
      },
    };

    const result = generateRecommendation(input, mockAIEngine);

    expect(result).toEqual({
      success: false,
      errorCode: 'INVALID_INPUT_CURRENT_ACCURACY_REQUIRED',
      errorMessage: '改善提案の生成には、現在の推奨精度の指定が必須です',
    });
    expect(mockAIEngine.generateRecommendation).not.toHaveBeenCalled();
  });
});