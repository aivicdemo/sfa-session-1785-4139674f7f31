import { calculateRecommendationTrustScore } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェント推奨根拠の可視化機能", () => {
  // SCEN-792
  test("推奨信頼度スコア算出機能 - 根拠データが複数件のとき、すべてが信頼度算出に含まれる", () => {
    const mockAIEngine = {
      findSimilarPatterns: jest.fn().mockReturnValue([
        {
          id: "pattern_A",
          name: "パターンA",
          industry: "IT",
          budgetScale: "large_enterprise",
        },
        {
          id: "pattern_B",
          name: "パターンB",
          industry: "IT",
          budgetScale: "large_enterprise",
        },
        {
          id: "pattern_C",
          name: "パターンC",
          industry: "IT",
          budgetScale: "large_enterprise",
        },
      ]),
      evaluatePatternRelevance: jest
        .fn()
        .mockImplementation((patternId: string) => {
          const scoreMap: { [key: string]: number } = {
            pattern_A: 0.85,
            pattern_B: 0.72,
            pattern_C: 0.68,
          };
          return scoreMap[patternId] || 0;
        }),
    };

    const dealCondition = {
      industry: "IT",
      budgetScale: "large_enterprise",
    };

    const result = calculateRecommendationTrustScore(dealCondition, mockAIEngine);

    const expectedTrustScore = (0.85 + 0.72 + 0.68) / 3;

    expect(mockAIEngine.findSimilarPatterns).toHaveBeenCalledWith(dealCondition);
    expect(mockAIEngine.findSimilarPatterns).toHaveBeenCalledTimes(1);

    expect(mockAIEngine.evaluatePatternRelevance).toHaveBeenCalledWith(
      "pattern_A"
    );
    expect(mockAIEngine.evaluatePatternRelevance).toHaveBeenCalledWith(
      "pattern_B"
    );
    expect(mockAIEngine.evaluatePatternRelevance).toHaveBeenCalledWith(
      "pattern_C"
    );
    expect(mockAIEngine.evaluatePatternRelevance).toHaveBeenCalledTimes(3);

    expect(result).toBe(Math.round(expectedTrustScore * 100) / 100);
  });
});