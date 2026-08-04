import { evaluatePatternRelevance } from '../../src/logic/it-1-br-3-3-2-1';

describe('パターン適用可能性評価機能', () => {
  test('SCEN-062: 評価対象パターンが0件の場合に空の結果が正常に返される', () => {
    // Arrange
    const mockAIRecommendationEngine = {
      evaluatePatternRelevance: jest.fn().mockResolvedValue([]),
    };

    const dealCondition = {
      customerSize: 'medium',
      industry: 'finance',
      productCategory: 'cloud_services',
    };

    // Act
    const result = evaluatePatternRelevance(
      dealCondition,
      mockAIRecommendationEngine
    );

    // Assert
    expect(result).resolves.toEqual({
      evaluatedPatterns: [],
      relevanceScores: {},
      isError: false,
      message: null,
    });
  });
});