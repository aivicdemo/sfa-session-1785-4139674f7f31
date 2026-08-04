import { evaluateProposalAgainstCustomerConstraints } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェントの推奨根拠の可視化機能", () => {
  // SCEN-1321
  test("[normal] 提案内容と顧客制約条件の自動照合機能 - 予算制約値が提案金額より1単位上回るとき、適合判定が肯定で返される", () => {
    const customerConstraint = {
      customerId: "CUST-001",
      budgetLimit: 1000000,
      maxPurchaseFrequency: 12,
      allowedProductCategories: ["category_a", "category_b"],
    };

    const proposalContent = {
      proposalId: "PROP-001",
      totalAmount: 999000,
      productCategory: "category_a",
      proposedScheduleMonths: 6,
    };

    const aiEngineStub = {
      evaluatePatternRelevance: jest.fn().mockResolvedValue({
        score: 85,
        isApplicable: true,
      }),
    };

    const result = evaluateProposalAgainstCustomerConstraints(
      proposalContent,
      customerConstraint,
      aiEngineStub
    );

    expect(result.isCompliant).toBe(true);
    expect(result.reasonCode).toBe("BUDGET_CONSTRAINT_SATISFIED");
    expect(result.detailMessage).toContain(
      "提案金額99万9千円は顧客予算制約値100万円以内に収まるため、予算条件に適合します"
    );
  });
});