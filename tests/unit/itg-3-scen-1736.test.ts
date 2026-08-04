import { evaluatePatternRelevance } from '../../src/logic/it-1-br-3-3-2-1';

describe('推奨妥当性スコア算出機能', () => {
  // SCEN-1736
  test('適用可能性評価値が0.51のとき推奨スコアを計算する', () => {
    const relevanceScore = 0.51;
    const expectedRecommendationScore = 51.0;

    const result = evaluatePatternRelevance({
      relevanceScore: relevanceScore,
    });

    expect(result.recommendationScore).toBe(expectedRecommendationScore);
    expect(result.isRecommended).toBe(true);
  });
});