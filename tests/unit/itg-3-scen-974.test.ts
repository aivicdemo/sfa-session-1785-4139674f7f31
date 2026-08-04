import { explainRecommendationReasoning } from '../../src/logic/it-1-br-3-2-1-1';

describe('AIエージェント推奨内容の根拠表示機能', () => {
  test('SCEN-974: 提案内容の商品IDが空文字列のとき、根拠マッピング処理が開始されず警告が返される', () => {
    // Arrange
    const mockAIRecommendationEngine = {
      explainRecommendationReasoning: jest.fn().mockResolvedValue({
        reasoning: 'mock reasoning',
        evidence: [],
      }),
    };

    const proposalWithEmptyProductId = {
      proposalId: 'PROP-001',
      customerId: 'CUST-001',
      productId: '',
      proposalContent: '提案内容テキスト',
      proposalAmount: 100000,
      proposedDate: '2024-01-15T10:00:00Z',
    };

    // Act
    const result = explainRecommendationReasoning(
      proposalWithEmptyProductId,
      mockAIRecommendationEngine
    );

    // Assert
    expect(result).toEqual({
      error: {
        type: 'VALIDATION_ERROR',
        code: 'EMPTY_PRODUCT_ID',
        message: '商品IDが未指定です',
      },
      reasoning: null,
      evidence: [],
    });

    expect(mockAIRecommendationEngine.explainRecommendationReasoning).toHaveBeenCalledTimes(0);
  });
});