import { explainRecommendationReasoning } from "../../src/logic/it-1-br-3-1-1-1";

const fetchMock = require("jest-fetch-mock");

describe("AIエージェントの推奨根拠の可視化機能", () => {
  // SCEN-1017
  test("推奨根拠が空の場合、簡略版の根拠説明が返却される", async () => {
    fetchMock.resetMocks();

    const mockAIRecommendationEngine = {
      explainRecommendationReasoning: jest.fn().mockResolvedValue(""),
    };

    const recommendationData = {
      recommendationId: "REC-2024-001",
      customerId: "CUST-5001",
      dealId: "DEAL-1001",
      recommendedApproach: "提案アプローチA",
      recommendationReasoning: "",
      confidenceScore: 85,
      timestamp: new Date("2024-01-15T11:00:00Z"),
    };

    const result = await explainRecommendationReasoning(
      recommendationData,
      mockAIRecommendationEngine
    );

    expect(result).toBeDefined();
    expect(typeof result).toBe("string");
    expect(result.length).toBeGreaterThan(0);
    expect(result).toContain("成功");
    expect(result).toContain("推奨");
    expect(/<[^>]*>/g.test(result)).toBe(false);
  });
});