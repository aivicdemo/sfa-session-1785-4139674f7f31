import { calculateRecommendationScore } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェント推奨根拠の可視化機能 - 推奨スコア算出機能', () => {
  test('SCEN-1654: 推奨スコア算出機能 - 顧客IDが空文字列のとき、エラーが発生する', () => {
    // Arrange
    const mockAIEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const inputParams = {
      customerId: '',
      dealDetails: {
        dealId: 'DEAL-001',
        productCategory: 'Software',
        estimatedValue: 500000,
      },
    };

    // Act
    const result = calculateRecommendationScore(inputParams, mockAIEngine);

    // Assert
    expect(result).toEqual({
      isError: true,
      errorCode: 'INVALID_CUSTOMER_ID',
      errorMessage: '顧客IDは空文字列で指定することはできません',
    });

    // 外部サービスへの呼び出しが実行されないことを確認
    expect(mockAIEngine.generateRecommendation).not.toHaveBeenCalled();
    expect(mockAIEngine.findSimilarPatterns).not.toHaveBeenCalled();
    expect(mockAIEngine.explainRecommendationReasoning).not.toHaveBeenCalled();
    expect(mockAIEngine.evaluatePatternRelevance).not.toHaveBeenCalled();
  });
});