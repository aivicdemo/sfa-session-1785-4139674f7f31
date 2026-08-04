import { evaluateProposalValidity } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェントの推奨根拠の可視化機能", () => {
  // SCEN-1229
  test("提案妥当性確認判定機能 - 改善指摘が null のとき、エラーを返す", () => {
    const mockAIRecommendationEngine = {
      evaluatePatternRelevance: jest.fn().mockResolvedValue({
        relevance_score: 85,
        applicable_pattern: "pattern_001",
        improvement_suggestion: null,
      }),
    };

    const input_params = {
      proposal_content: {
        product_name: "Enterprise Cloud Solution",
        estimated_investment: 5000000,
        implementation_timeline_months: 6,
      },
      customer_constraints: {
        budget_limit: 10000000,
        max_implementation_months: 12,
        required_features: ["scalability", "security"],
      },
      business_goal: "digital_transformation",
      ai_engine: mockAIRecommendationEngine,
    };

    expect(() =>
      evaluateProposalValidity(input_params)
    ).toThrow(/改善指摘/);

    try {
      evaluateProposalValidity(input_params);
    } catch (error) {
      if (error instanceof Error) {
        expect(error.message).toContain("改善指摘は必須項目です");
        expect(error.message).toContain("null は許可されません");
      }
    }
  });
});