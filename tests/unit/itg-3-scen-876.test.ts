import { calculateRecommendationConfidenceScore } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェント推奨根拠の可視化 - 推奨信頼度スコア算出', () => {
  test('SCEN-876: 推奨生成から推奨提示までの期間が0日のとき信頼度スコアに減衰が適用されない', () => {
    const currentTimestamp = new Date('2024-06-15T14:30:00Z');
    const recommendationObject = {
      recommendationGeneratedAt: currentTimestamp,
      recommendationPresentedAt: currentTimestamp,
      baseConfidenceScore: 100,
    };

    const result = calculateRecommendationConfidenceScore(recommendationObject);

    const elapsedDays = Math.floor(
      (recommendationObject.recommendationPresentedAt.getTime() -
        recommendationObject.recommendationGeneratedAt.getTime()) /
        (1000 * 60 * 60 * 24)
    );

    expect(elapsedDays).toBe(0);
    expect(result).toBe(100.0);
  });
});