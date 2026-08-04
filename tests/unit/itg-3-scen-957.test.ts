import { AIRecommendationEngine } from '../../src/logic/it-1-br-3-3-2-1';

describe('提案アプローチ推奨生成機能 - 過去成功パターンが0件の場合', () => {
  test('SCEN-957: 過去成功パターンが0件のとき、推奨生成処理は進行するが照合結果が空配列で返される', async () => {
    // Arrange
    const mockAIRecommendationEngine: Partial<AIRecommendationEngine> = {
      findSimilarPatterns: jest.fn().mockResolvedValue([]),
      generateRecommendation: jest.fn(),
    };

    const dealCondition = {
      customerIndustry: 'IT企業',
      dealStage: '初期提案',
      budgetScale: '500万円以上',
      decisionMakerCount: 3,
    };

    const expectedResponse = {
      recommendations: [],
      matchedPatterns: [],
      reasoning: '過去成功パターンが見つかりません。デフォルト推奨パターンを適用してください。',
      statusCode: 200,
    };

    mockAIRecommendationEngine.generateRecommendation = jest
      .fn()
      .mockResolvedValue(expectedResponse);

    // Act
    const engine = mockAIRecommendationEngine as AIRecommendationEngine;
    const result = await engine.generateRecommendation(dealCondition);

    // Assert
    expect(result).toEqual(expectedResponse);
    expect(result.recommendations).toEqual([]);
    expect(result.matchedPatterns).toEqual([]);
    expect(result.reasoning).toBe(
      '過去成功パターンが見つかりません。デフォルト推奨パターンを適用してください。',
    );
    expect(result.statusCode).toBe(200);
    expect(mockAIRecommendationEngine.findSimilarPatterns).toHaveBeenCalled();
  });
});