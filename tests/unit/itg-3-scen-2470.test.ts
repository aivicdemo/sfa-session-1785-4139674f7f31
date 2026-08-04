import { explainRecommendationReasoning } from '../../src/logic/it-1-br-3-2-1-1';

describe('AIエージェント推奨内容の根拠表示機能', () => {
  // SCEN-2470
  test('推奨内容が0件のとき、根拠表示が空状態となる', () => {
    // Arrange: 推奨内容が0件のシナリオ
    const recommendations = [];
    const customerId = 'CUST-12345';
    const dealId = 'DEAL-67890';

    // 推奨内容が空の場合、根拠説明を生成しない仕様
    const aiRecommendationEngineStub = {
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendations: recommendations,
        timestamp: new Date('2024-01-15T11:00:00Z'),
      }),
      explainRecommendationReasoning: jest.fn(),
      findSimilarPatterns: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    // Act: 推奨内容が0件の場合の根拠表示処理
    const result = explainRecommendationReasoning(
      {
        customerId: customerId,
        dealId: dealId,
        recommendations: recommendations,
      },
      aiRecommendationEngineStub
    );

    // Assert: 根拠表示が空状態であることを確認
    expect(result).toEqual({
      reasoning: '',
      hasReasoning: false,
      placeholderMessage: '根拠情報はありません',
      recommendationCount: 0,
    });

    // AIRecommendationEngineのexplainRecommendationReasoningメソッドが呼び出されないことを確認
    expect(aiRecommendationEngineStub.explainRecommendationReasoning).not.toHaveBeenCalled();
  });
});