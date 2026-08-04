import { generateRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('AIエージェント推奨支援システム - 成功パターン関連度スコア検証', () => {
  test('SCEN-115: 関連度スコアが負の値の場合エラーを返す', () => {
    // Arrange
    const mockAIEngine = {
      evaluatePatternRelevance: jest.fn().mockReturnValue(-0.5),
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
    };

    const newDealData = {
      customerIndustry: '製造業',
      budgetScale: 5000000,
      decisionMakerCount: 3,
      dealStage: 'initial',
      dealValue: 5000000,
    };

    // Act & Assert
    expect(() => {
      generateRecommendation(newDealData, mockAIEngine);
    }).toThrow(/関連度スコア/);
  });
});