import { explainRecommendationReasoning } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェントの推奨根拠の可視化機能", () => {
  // SCEN-2610
  test("成功パターンの成功要因が言語化された状態で存在する場合、その要因が根拠説明に正確に含まれる", async () => {
    const successFactorText =
      "顧客の予算承認プロセスを事前にヒアリングし、決裁者を早期に巻き込んだ";

    const mockSuccessPattern = {
      pattern_id: "pat-001",
      customer_size: "medium",
      industry: "manufacturing",
      success_factor: successFactorText,
      deal_stage: "proposal",
      approval_rate: 0.85,
    };

    const mockAIEngine = {
      explainRecommendationReasoning: jest
        .fn()
        .mockResolvedValue(
          `推奨理由: この案件は過去の成功事例に合致しています。${successFactorText}ことが重要な成功要因として確認されています。そのため、本案件でも同様のアプローチを推奨します。`
        ),
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const newDealCondition = {
      customer_id: "cust-123",
      customer_size: "medium",
      industry: "manufacturing",
      deal_stage: "proposal",
      estimated_budget: 5000000,
    };

    const result = await explainRecommendationReasoning(
      newDealCondition,
      mockSuccessPattern,
      mockAIEngine
    );

    expect(result).toContain(successFactorText);
    expect(result.includes("顧客の予算承認プロセスを事前にヒアリングし")).toBe(
      true
    );
    expect(result.includes("決裁者を早期に巻き込んだ")).toBe(true);
    expect(result).toMatch(/顧客の予算承認プロセスを事前にヒアリングし/);
  });
});