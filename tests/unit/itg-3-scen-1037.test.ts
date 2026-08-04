import { generateRecommendation } from "../../src/logic/it-1-br-3-3-2-1";

describe("提案アプローチの推奨判定", () => {
  test("SCEN-1037: 同一スコアの提案アプローチは優先度順に再ソートされる", async () => {
    const mockRecommendationEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendations: [
          {
            approachId: "approach_a",
            name: "アプローチA",
            relevanceScore: 0.85,
            priority: 3,
          },
          {
            approachId: "approach_b",
            name: "アプローチB",
            relevanceScore: 0.85,
            priority: 1,
          },
          {
            approachId: "approach_c",
            name: "アプローチC",
            relevanceScore: 0.85,
            priority: 2,
          },
        ],
      }),
    };

    const newOpportunityCriteria = {
      customerSize: "mid_market",
      industry: "manufacturing",
      businessChallenge: "digital_transformation",
    };

    const result = await generateRecommendation(
      newOpportunityCriteria,
      mockRecommendationEngine
    );

    expect(result.recommendations).toHaveLength(3);
    expect(result.recommendations[0].approachId).toBe("approach_b");
    expect(result.recommendations[0].priority).toBe(1);
    expect(result.recommendations[1].approachId).toBe("approach_c");
    expect(result.recommendations[1].priority).toBe(2);
    expect(result.recommendations[2].approachId).toBe("approach_a");
    expect(result.recommendations[2].priority).toBe(3);
    expect(result.recommendations[0].relevanceScore).toBe(0.85);
    expect(result.recommendations[1].relevanceScore).toBe(0.85);
    expect(result.recommendations[2].relevanceScore).toBe(0.85);
  });
});