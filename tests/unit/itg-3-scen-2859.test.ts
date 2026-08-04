import { validateRecommendationContent } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  test('SCEN-2859: [error] 推奨内容検証判定機能 - 成約実績データが空配列のとき、エラーを返す', () => {
    // Arrange
    const emptyDealRecords: any[] = [];
    const aiRecommendationEngineStub = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    // Act
    const result = validateRecommendationContent(
      emptyDealRecords,
      aiRecommendationEngineStub
    );

    // Assert
    expect(result).toEqual({
      errorCode: 'EMPTY_DEAL_RECORDS',
      errorMessage: '成約実績データが存在しません。推奨の生成を続行できません',
      statusCode: 400,
    });
    expect(aiRecommendationEngineStub.generateRecommendation).not.toHaveBeenCalled();
    expect(aiRecommendationEngineStub.findSimilarPatterns).not.toHaveBeenCalled();
    expect(aiRecommendationEngineStub.explainRecommendationReasoning).not.toHaveBeenCalled();
    expect(aiRecommendationEngineStub.evaluatePatternRelevance).not.toHaveBeenCalled();
  });
});