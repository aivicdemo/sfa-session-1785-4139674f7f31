import { explainRecommendationReasoning } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェントの推奨根拠の可視化機能", () => {
  test("SCEN-2805: explainRecommendationReasoningが失敗したとき、エラーを返す", async () => {
    const mockAIEngine = {
      explainRecommendationReasoning: jest.fn().mockRejectedValue(
        new Error("OpenAI API connection failed")
      ),
    };

    const recommendationInput = {
      recommendationId: "rec-12345",
      customerId: "cust-67890",
      customerIndustry: "製造業",
      customerScale: "大企業",
      proposalApproach: "コスト削減提案",
      similarPatternCount: 5,
      matchingSuccessRate: 0.82,
    };

    try {
      await explainRecommendationReasoning(recommendationInput, mockAIEngine);
      fail("Should have thrown an error");
    } catch (error: any) {
      expect(error).toBeDefined();
      expect(error.message).toMatch(/OpenAI API/);
      expect(mockAIEngine.explainRecommendationReasoning).toHaveBeenCalledWith(
        recommendationInput
      );
    }
  });
});