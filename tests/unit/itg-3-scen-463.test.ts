import { trackImprovementMetrics } from '../../src/logic/itg-3';

describe('AIエージェント推奨支援システム - 改善実績トラッキング機能', () => {
  // SCEN-463
  test('改善前スコアから改善後スコアへの変化が複数項目にわたる場合、全項目の改善度が集計される', () => {
    const preImprovementScores = {
      itemA: 60,
      itemB: 70,
      itemC: 50,
    };

    const postImprovementScores = {
      itemA: 75,
      itemB: 85,
      itemC: 65,
    };

    const mockAIEngine = {
      evaluatePatternRelevance: jest.fn((item, preScore, postScore) => {
        return postScore - preScore;
      }),
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
    };

    const result = trackImprovementMetrics(
      preImprovementScores,
      postImprovementScores,
      mockAIEngine
    );

    expect(result.totalImprovementPoints).toBe(45);
    expect(result.averageImprovementPoints).toBe(15);
    expect(result.improvementItemCount).toBe(3);
    expect(result.itemBreakdown).toEqual({
      itemA: 15,
      itemB: 15,
      itemC: 15,
    });
  });
});