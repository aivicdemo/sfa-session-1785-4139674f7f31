import { explainRecommendationReasoning } from '../../src/logic/it-1-br-3-2-1-1';

describe('AIエージェント推奨内容の根拠表示機能', () => {
  test('SCEN-2566: 根拠テキストが欠落しているとき、例外が発生する', () => {
    // Arrange
    const recommendationId = 'REC-20240115-001';
    const emptyReasoningText = '';
    const mockAIRecommendationEngine = {
      explainRecommendationReasoning: jest.fn().mockReturnValue(emptyReasoningText),
    };

    // Act & Assert
    expect(() =>
      explainRecommendationReasoning(
        recommendationId,
        emptyReasoningText,
        mockAIRecommendationEngine
      )
    ).toThrow(/推奨根拠/);
  });
});