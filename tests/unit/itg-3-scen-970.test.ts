import { RecommendationReasoningDisplay } from '../../src/logic/it-1-br-3-2-1-1';

describe('AIエージェント推奨内容の根拠表示機能', () => {
  test('SCEN-970: 提案内容が空オブジェクト {} のとき、根拠表示処理が開始されず警告が返される', () => {
    // Arrange
    const emptyProposal = {};
    const mockExplainRecommendationReasoning = jest.fn();
    const aiRecommendationEngineStub = {
      explainRecommendationReasoning: mockExplainRecommendationReasoning,
    };
    const fixedTimestamp = '2024-01-15T11:00:00Z';
    jest.useFakeTimers();
    jest.setSystemTime(new Date(fixedTimestamp));

    // Act
    const result = RecommendationReasoningDisplay(
      emptyProposal,
      aiRecommendationEngineStub
    );

    // Assert
    expect(result).toEqual({
      status: 'error',
      errorCode: 'INVALID_PROPOSAL_OBJECT',
      message: '提案内容が空オブジェクトです。根拠表示処理を開始できません',
      timestamp: fixedTimestamp,
    });
    expect(mockExplainRecommendationReasoning).not.toHaveBeenCalled();

    jest.useRealTimers();
  });
});