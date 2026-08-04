import { evaluateProposalValidity } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェント推奨根拠の可視化機能", () => {
  test("SCEN-1276: 提案有効期間の開始日と終了日が同一日である場合に判定が正確に行われる", () => {
    const proposalStartDate = new Date("2026-08-01T00:00:00Z");
    const proposalEndDate = new Date("2026-08-01T23:59:59Z");

    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn().mockReturnValue({
        relevanceScore: 0.85,
      }),
    };

    const proposalObject = {
      proposalId: "PROP-2026-08-001",
      customerId: "CUST-12345",
      proposalStartDate: proposalStartDate,
      proposalEndDate: proposalEndDate,
      proposalContent: {
        productName: "Enterprise Solution",
        suggestedPrice: 500000,
      },
      customerConstraints: {
        budgetLimit: 600000,
        maxImplementationDays: 90,
      },
    };

    const result = evaluateProposalValidity(
      proposalObject,
      mockAIRecommendationEngine
    );

    expect(result.isValid).toBe(true);
    expect(result.validityScore).toBe(0.85);
    expect(result.reasonMessage).toContain("提案有効期間は同一日です");
    expect(result.internalLog).toContain("duration_days: 0");
    expect(mockAIRecommendationEngine.evaluatePatternRelevance).toHaveBeenCalled();
  });
});