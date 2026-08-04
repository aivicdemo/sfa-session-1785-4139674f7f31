import { visualizeRecommendationReasoning } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェントの推奨根拠の可視化機能", () => {
  // SCEN-1750
  test("根拠が逆順で入力されたとき正順でソートして返す", () => {
    const mockRecommendationResult = {
      recommendationId: "REC-20240115-001",
      customerId: "CUST-001",
      proposalApproach: "提案アプローチA",
      confidenceScore: 85,
      reasoningBasis: ["根拠3", "根拠2", "根拠1"],
      timestamp: new Date("2024-01-15T11:00:00Z"),
    };

    const result = visualizeRecommendationReasoning(mockRecommendationResult);

    expect(result.reasoningBasis).toEqual(["根拠1", "根拠2", "根拠3"]);
    expect(result.recommendationId).toBe("REC-20240115-001");
    expect(result.customerId).toBe("CUST-001");
    expect(result.proposalApproach).toBe("提案アプローチA");
    expect(result.confidenceScore).toBe(85);
  });
});