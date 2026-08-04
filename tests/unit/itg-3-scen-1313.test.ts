import { evaluateProposalConstraintAlignment } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェント推奨根拠の可視化 - 提案内容と顧客制約条件の自動照合", () => {
  test("SCEN-1313: 複数の顧客制約条件のうち1つが満たされないとき、全体適合性スコアが低下する", () => {
    const customerConstraints = [
      {
        constraint_id: "CSTR001",
        constraint_type: "budget",
        constraint_value: 5000000,
        constraint_unit: "JPY",
      },
      {
        constraint_id: "CSTR002",
        constraint_type: "delivery_period",
        constraint_value: 3,
        constraint_unit: "month",
      },
      {
        constraint_id: "CSTR003",
        constraint_type: "deployment_environment",
        constraint_value: "cloud_only",
        constraint_unit: "string",
      },
    ];

    const proposalContent = {
      proposal_amount: 4800000,
      delivery_period_months: 2.5,
      deployment_environment: "on_premise_only",
    };

    const initial_conformity_score = 85;

    const aiRecommendationEngineStub = {
      generateRecommendation: jest.fn().mockReturnValue({
        recommendation_id: "REC001",
        initial_conformity_score: initial_conformity_score,
        proposal_approach: "test_approach",
        success_pattern_id: "SP001",
      }),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const result = evaluateProposalConstraintAlignment(
      customerConstraints,
      proposalContent,
      aiRecommendationEngineStub
    );

    expect(result.constraint_evaluation_results).toHaveLength(3);

    expect(result.constraint_evaluation_results[0]).toMatchObject({
      constraint_id: "CSTR001",
      constraint_type: "budget",
      is_satisfied: true,
      evaluation_reason: "提案金額4800000円は予算上限5000000円以内",
    });

    expect(result.constraint_evaluation_results[1]).toMatchObject({
      constraint_id: "CSTR002",
      constraint_type: "delivery_period",
      is_satisfied: true,
      evaluation_reason: "納期2.5ヶ月は要件3ヶ月以内",
    });

    expect(result.constraint_evaluation_results[2]).toMatchObject({
      constraint_id: "CSTR003",
      constraint_type: "deployment_environment",
      is_satisfied: false,
      evaluation_reason:
        "導入環境: 顧客要件はクラウドのみだが、提案環境はオンプレミスのみ",
    });

    expect(result.overall_conformity_score).toBeLessThanOrEqual(70);
    expect(result.overall_conformity_score).toBeGreaterThan(0);

    expect(result.unsatisfied_constraints_count).toBe(1);
    expect(result.constraint_satisfaction_rate).toBe((2 / 3) * 100);
  });
});