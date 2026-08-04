import { evaluateRecommendationCredibility } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェントの推奨根拠の可視化機能", () => {
  test("SCEN-1647: 推奨スコア算出機能 - 現在の提案内容が null のとき、エラーが発生する", () => {
    const mockAIRecommendationEngine = {
      evaluatePatternRelevance: jest.fn(),
    };

    const currentProposal = null;
    const recommendationHistory = {
      recommendationId: "REC-001",
      customerId: "CUST-001",
      proposalContent: "Sample proposal",
      timestamp: new Date("2024-01-15T11:00:00Z"),
      confidenceScore: 85,
    };
    const successPatterns = [
      {
        patternId: "PAT-001",
        customerSegment: "Enterprise",
        successRate: 0.92,
      },
    ];

    expect(() =>
      evaluateRecommendationCredibility(
        currentProposal,
        recommendationHistory,
        successPatterns,
        mockAIRecommendationEngine
      )
    ).toThrow(/提案内容/);

    expect(mockAIRecommendationEngine.evaluatePatternRelevance).not.toHaveBeenCalled();
  });
});