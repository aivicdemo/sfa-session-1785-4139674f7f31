import { evaluateProposalFeasibility } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェントの推奨根拠の可視化機能", () => {
  // SCEN-1387
  test("提案内容と顧客制約条件の自動照合機能 - 顧客の予算制約が提案金額未満のとき、実装可能性が0%と判定される", () => {
    const mockAIEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        proposalAmount: 5000000,
        implementationPeriodDays: 90,
        recommendedApproach: "標準提案パッケージ",
        reasoning: "顧客の業種と規模に基づいた標準的な提案",
      }),
    };

    const customerConstraints = {
      budgetLimit: 3000000,
      projectPeriodConstraintDays: 180,
      customerId: "CUST-001",
      constraintType: "hard",
    };

    const proposalData = {
      proposalAmount: 5000000,
      implementationPeriodDays: 90,
      productCategory: "enterprise_solution",
      customerId: "CUST-001",
    };

    const result = evaluateProposalFeasibility(
      proposalData,
      customerConstraints,
      mockAIEngine
    );

    expect(result.feasibilityScore).toBe(0);
    expect(result.judgmentReasonCode).toBe("BUDGET_CONSTRAINT_VIOLATION");
    expect(result.isFeasible).toBe(false);
    expect(result.violatedConstraints).toContain("budget");
  });
});