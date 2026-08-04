import { calculateImprovementPriorityRank } from '../../src/logic/itg-3';

describe('AIエージェント推奨支援システム', () => {
  // SCEN-485
  test('改善優先度ランク算出機能 - 改善対象項目リストが空配列のときエラーが発生する', () => {
    const mockAIEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const improvementItems: string[] = [];
    const dataQualityScore = 85;

    expect(() => {
      calculateImprovementPriorityRank(improvementItems, dataQualityScore, mockAIEngine);
    }).toThrow(/改善対象項目リストが空/);
  });
});