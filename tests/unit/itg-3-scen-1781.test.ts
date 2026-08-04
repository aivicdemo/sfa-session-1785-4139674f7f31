import { explainRecommendationReasoning } from "../../src/logic/it-1-br-3-1-1-1";

describe("推奨根拠の可視化機能", () => {
  // SCEN-1781
  test("[normal] 推奨根拠が存在しない場合、空の根拠リストが返却される", async () => {
    const recommendationId = "REC-20240115-001";
    
    const mockAIEngine = {
      explainRecommendationReasoning: jest.fn().mockResolvedValue([]),
    };

    const result = await explainRecommendationReasoning(
      recommendationId,
      mockAIEngine
    );

    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(0);
    expect(mockAIEngine.explainRecommendationReasoning).toHaveBeenCalledWith(
      recommendationId
    );
  });
});