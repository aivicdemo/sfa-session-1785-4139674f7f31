import { trackImprovementResults } from '../../src/logic/itg-3';

describe('AIエージェント推奨支援システム', () => {
  // SCEN-463
  test('改善実績トラッキング機能 - 改善前スコアから改善後スコアへの変化が複数項目にわたる場合、全項目の改善度が集計される', () => {
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

    const mockAIRecommendationEngine = {
      evaluatePatternRelevance: jest.fn((item: string, preSocore: number, postScore: number) => {
        return postScore - preSocore;
      }),
    };

    const result = trackImprovementResults(
      preImprovementScores,
      postImprovementScores,
      mockAIRecommendationEngine
    );

    expect(result.totalImprovementDegree).toBe(45);
    expect(result.averageImprovementDegree).toBe(15);
    expect(result.numberOfImprovedItems).toBe(3);
    expect(result.itemBreakdown).toEqual({
      itemA: 15,
      itemB: 15,
      itemC: 15,
    });
  });
});