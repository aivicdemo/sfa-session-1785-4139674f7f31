import { explainRecommendationReasoning } from '../../src/logic/it-1-br-3-2-1-1';

describe('AIエージェント推奨内容の根拠表示機能', () => {
  test('SCEN-1099: 推奨内容IDがnullのとき、根拠表示処理がエラーになる', () => {
    // Arrange: AIRecommendationEngineのスタブを準備
    const aiEngineStub = {
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendationId: null,
        approach: 'some approach',
        confidence: 85,
      }),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn().mockRejectedValue(
        new Error(
          JSON.stringify({
            errorCode: 'INVALID_RECOMMENDATION_ID',
            errorMessage: '推奨IDが無効です',
          })
        )
      ),
      evaluatePatternRelevance: jest.fn(),
    };

    const recommendationId = null;

    // Act & Assert: explainRecommendationReasoningメソッド呼び出し時にエラーが発生することを検証
    expect(() => {
      return explainRecommendationReasoning(recommendationId, aiEngineStub);
    }).toThrow(/推奨ID/);
  });
});