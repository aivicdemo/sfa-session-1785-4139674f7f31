import { evaluateProposalConstraintFit } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェントの推奨根拠の可視化機能", () => {
  test("SCEN-1320: 提案内容と顧客制約条件の自動照合機能 - 予算制約値がちょうど提案金額と一致するとき、適合判定が肯定で返される", () => {
    const customerConstraints = {
      customerId: "cust_001",
      budgetLimit: 500000,
      scheduleConstraint: "2024-12-31",
      productCategoryAllowed: ["category_A", "category_B"],
    };

    const proposalContent = {
      proposalId: "prop_001",
      amount: 500000,
      scheduledDelivery: "2024-12-25",
      proposedProductCategory: "category_A",
    };

    const aiRecommendationEngineStub = {
      evaluatePatternRelevance: jest.fn().mockResolvedValue({
        relevanceScore: 85,
        isApplicable: true,
      }),
    };

    const result = evaluateProposalConstraintFit(
      customerConstraints,
      proposalContent,
      aiRecommendationEngineStub
    );

    expect(result.fitStatus).toBe(true);
    expect(result.fitReason).toContain("提案金額 500,000 円は顧客予算制約値 500,000 円と一致しており、予算要件を満たしています");
    expect(result.mappingDetails).toEqual(
      expect.objectContaining({
        budgetCheck: "MATCHED",
      })
    );
  });
});