import { calculateRecommendationScore } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェント推奨根拠の可視化 - 推奨スコア算出", () => {
  // SCEN-1659
  test("提案金額が0のとき、INVALID_PROPOSAL_AMOUNTエラーが発生する", () => {
    const customerId = "CUST-001";
    const dealConditions = {
      industry: "製造業",
      companySize: "medium",
      budget: 5000000,
      timeline: "Q2",
    };
    const proposalAmount = 0;
    const customerHistory = {
      previousPurchases: 3,
      totalValue: 10000000,
      lastInteractionDate: "2024-01-15",
    };
    const aiRecommendationEngineStub = {
      generateRecommendation: jest.fn().mockResolvedValue({
        approach: "提案アプローチA",
        confidence: 0.85,
      }),
      findSimilarPatterns: jest.fn().mockResolvedValue([]),
      explainRecommendationReasoning: jest.fn().mockResolvedValue(""),
      evaluatePatternRelevance: jest.fn().mockResolvedValue(0),
    };

    expect(() =>
      calculateRecommendationScore(
        customerId,
        dealConditions,
        proposalAmount,
        customerHistory,
        aiRecommendationEngineStub
      )
    ).toThrow(/INVALID_PROPOSAL_AMOUNT/);

    expect(
      aiRecommendationEngineStub.generateRecommendation
    ).not.toHaveBeenCalled();
  });
});