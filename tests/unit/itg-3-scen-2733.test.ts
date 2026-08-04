import { explainRecommendationReasoning } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェントの推奨根拠の可視化機能", () => {
  // SCEN-2733
  test("推奨内容IDが欠落しているとき根拠説明生成が失敗する", async () => {
    const mockAIEngine = {
      explainRecommendationReasoning: jest.fn().mockRejectedValue(
        new Error("Recommendation ID is required")
      ),
    };

    const testInput = {
      recommendationId: null,
      recommendationContent: "提案内容テキスト",
      customerData: {
        customerId: "CUST001",
        industry: "製造業",
        scale: "large",
      },
      recommendationBasis: {
        similarPatterns: ["PATTERN001", "PATTERN002"],
        historicalData: ["HIST001"],
      },
    };

    await expect(
      explainRecommendationReasoning(testInput, mockAIEngine)
    ).rejects.toThrow(/Recommendation ID/);

    expect(mockAIEngine.explainRecommendationReasoning).not.toHaveBeenCalled();
  });
});