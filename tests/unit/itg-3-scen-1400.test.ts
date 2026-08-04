import { generateRecommendationWithConstraints } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェントの推奨根拠の可視化機能 - 顧客制約条件の自動照合", () => {
  // SCEN-1400
  test("顧客制約条件が1件のとき、提案内容の自動照合が実行される", () => {
    const customerConstraint = {
      constraint_id: "c001",
      customer_id: "cust_001",
      constraint_type: "budget_limit",
      constraint_value: 5000000,
      created_at: new Date("2024-01-15T10:00:00Z"),
    };

    const proposalContent = {
      proposal_id: "prop_001",
      customer_id: "cust_001",
      proposal_amount: 4500000,
      proposal_category: "solution_a",
      created_at: new Date("2024-01-15T10:30:00Z"),
    };

    const mockAIEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendation_id: "rec_001",
        proposal_id: "prop_001",
        reasoning: "提案額が顧客の予算上限以下であり、適切です",
        confidence_score: 85,
        eligible_proposals: [
          {
            proposal_id: "prop_001",
            proposal_amount: 4500000,
            matches_constraint: true,
          },
        ],
      }),
    };

    return generateRecommendationWithConstraints(
      proposalContent,
      [customerConstraint],
      mockAIEngine
    ).then((result) => {
      expect(mockAIEngine.generateRecommendation).toHaveBeenCalledTimes(1);
      expect(mockAIEngine.generateRecommendation).toHaveBeenCalledWith(
        proposalContent,
        customerConstraint
      );

      expect(result.recommendation_id).toBe("rec_001");
      expect(result.confidence_score).toBe(85);
      expect(result.eligible_proposals).toHaveLength(1);
      expect(result.eligible_proposals[0].proposal_amount).toBe(4500000);
      expect(result.eligible_proposals[0].matches_constraint).toBe(true);
    });
  });
});