import { explainRecommendationReasoning } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェントの推奨根拠の可視化機能", () => {
  // SCEN-2604
  test("推奨根拠の可視化機能 - 推奨パターンの選定理由が営業担当者向けに自然言語で生成される", async () => {
    const mockAIEngine = {
      explainRecommendationReasoning: jest.fn().mockResolvedValue(
        "貴社と同じ製造業の顧客A社（従業員500名）は、生産ラインの自動化提案により、3ヶ月で生産効率を15%向上させ、ROI 8ヶ月で導入決定されました。同様の課題構造を持つ貴社案件にも、段階的な実装アプローチ（第1段階：コア工程の自動化、第2段階：全体最適化）を推奨します。"
      ),
    };

    const testProposalData = {
      customer_industry: "製造業",
      customer_employees: 500,
      business_challenge: "生産効率化",
      budget_jpy: 5000000,
      proposal_approach:
        "生産ラインの自動化による生産効率向上、段階的実装",
      past_success_customer_name: "A社",
      past_success_customer_employees: 500,
      past_success_efficiency_improvement_percent: 15,
      past_success_roi_months: 8,
      recommendation_pattern_id: "pattern_001",
    };

    const reasoningExplanation = await explainRecommendationReasoning(
      testProposalData,
      mockAIEngine
    );

    expect(mockAIEngine.explainRecommendationReasoning).toHaveBeenCalledWith(
      testProposalData
    );

    expect(reasoningExplanation).toContain("製造業");
    expect(reasoningExplanation).toContain("A社");
    expect(reasoningExplanation).toContain("従業員500名");
    expect(reasoningExplanation).toContain("生産効率を15%向上");
    expect(reasoningExplanation).toContain("ROI 8ヶ月");
    expect(reasoningExplanation).toContain("段階的な実装アプローチ");
    expect(reasoningExplanation).toContain("第1段階：コア工程の自動化");
    expect(reasoningExplanation).toContain("第2段階：全体最適化");

    const isNaturalLanguage =
      /[一-龥ぁ-ん]/.test(reasoningExplanation) &&
      reasoningExplanation.length > 50;
    expect(isNaturalLanguage).toBe(true);

    const hasConcreteExample =
      reasoningExplanation.includes("A社") &&
      reasoningExplanation.includes("500名") &&
      reasoningExplanation.includes("15%");
    expect(hasConcreteExample).toBe(true);

    const hasRecommendationDetail =
      reasoningExplanation.includes("段階的") &&
      reasoningExplanation.includes("推奨");
    expect(hasRecommendationDetail).toBe(true);
  });
});