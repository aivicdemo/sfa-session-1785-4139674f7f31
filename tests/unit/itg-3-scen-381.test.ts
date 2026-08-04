import { verifyRecommendationAccuracy } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェントの推奨根拠の可視化機能", () => {
  // SCEN-381
  test("推論精度検証機能 - 検証対象の推奨履歴が0件のとき、精度計測結果が0%として記録される", () => {
    const mockRecommendationHistory: Array<{
      id: string;
      recommendationId: string;
      status: string;
      result: string;
    }> = [];

    const mockAIEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const recordedAtFixed = new Date("2024-01-15T11:00:00Z");

    const result = verifyRecommendationAccuracy(
      mockRecommendationHistory,
      mockAIEngine,
      recordedAtFixed
    );

    expect(result.accuracy).toBe(0);
    expect(result.accuracyPercentage).toBe("0%");
    expect(result.recordedAt).toEqual(recordedAtFixed);
    expect(result.status).toBe("completed");
    expect(result.historyCount).toBe(0);
  });
});