import { explainRecommendationReasoning } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  test('SCEN-572: [edge] 推奨根拠説明文生成機能 - 推奨提案が0個のとき説明文が空文字列で返される', () => {
    // Arrange: 推奨提案が空配列の入力を準備
    const emptyRecommendations: any[] = [];
    const mockAIEngine = {
      generateRecommendation: jest.fn().mockResolvedValue([]),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    // Act: explainRecommendationReasoning()を呼び出し
    const result = explainRecommendationReasoning(emptyRecommendations, mockAIEngine);

    // Assert: 説明文が空文字列で返されることを検証
    expect(result).toBe('');
  });
});