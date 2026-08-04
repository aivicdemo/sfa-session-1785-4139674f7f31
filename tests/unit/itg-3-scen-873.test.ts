import { calculateRecommendationConfidenceScore } from "../../src/logic/it-1-br-3-3-2-1";

describe("推奨信頼度スコア算出機能", () => {
  // SCEN-873
  test("適用可能性評価結果が降順で入力されたとき信頼度スコアが0.8～0.9の範囲内で算出される", () => {
    const patternRelevanceScores = [
      { patternId: "pattern_a", relevanceScore: 0.95 },
      { patternId: "pattern_b", relevanceScore: 0.87 },
      { patternId: "pattern_c", relevanceScore: 0.72 },
      { patternId: "pattern_d", relevanceScore: 0.65 }
    ];

    const result = calculateRecommendationConfidenceScore(patternRelevanceScores);

    expect(result).toBeGreaterThanOrEqual(0.8);
    expect(result).toBeLessThanOrEqual(0.9);
    expect(typeof result).toBe("number");
  });
});