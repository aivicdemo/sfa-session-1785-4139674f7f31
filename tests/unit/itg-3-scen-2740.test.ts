import { fetchRecommendationWithReasoning } from "../../src/logic/it-1-br-3-2-1-1";

describe("AIエージェント推奨内容の根拠表示機能", () => {
  test("SCEN-2740: 推奨内容の表示・根拠表示 - 営業担当者の権限が不足しているとき推奨内容へのアクセスが拒否される", async () => {
    const user_id = "user_001";
    const user_role = "sales_representative";
    const recommendation_view_permission = false;
    const deal_id = "deal_001";

    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    mockAIRecommendationEngine.generateRecommendation.mockResolvedValueOnce({
      status: 403,
      code: "FORBIDDEN",
      message: "Insufficient permissions to view recommendation",
    });

    const requestPayload = {
      user_id,
      user_role,
      recommendation_view_permission,
      deal_id,
    };

    try {
      await fetchRecommendationWithReasoning(
        requestPayload,
        mockAIRecommendationEngine
      );
      fail("Expected function to throw permission error");
    } catch (error: any) {
      expect(error.message).toMatch(/権限/);
      expect(error.status).toBe(403);
    }
  });
});