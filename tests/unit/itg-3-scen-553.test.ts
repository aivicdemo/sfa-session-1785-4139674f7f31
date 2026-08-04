import { describe, test, expect, beforeEach, jest } from "@jest/globals";
import { generateSalesGuidancePolicy } from "../../src/logic/it-1-br-3-2-1-1";

describe("AIエージェント推奨内容の根拠表示機能", () => {
  // SCEN-553: [edge] 営業指導方針決定機能 - 改善優先度ランクが空値のときランク基準による判定がスキップされる
  test("should skip rank-based filtering when improvementPriorityRank is null", async () => {
    const mockAIEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendedApproach: "顧客業種と商談ステージに基づいた標準提案パターンA",
        confidenceScore: 78,
        reasoning: {
          customerIndustry: "製造業",
          companyScale: "大企業",
          dealStage: "提案準備段階",
          appliedFilters: ["customerIndustry", "companyScale", "dealStage"],
          rankBasedFilteringApplied: false,
        },
      }),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const input = {
      customerIndustry: "製造業",
      companyScale: "大企業",
      dealStage: "提案準備段階",
      improvementPriorityRank: null,
    };

    const result = await generateSalesGuidancePolicy(input, mockAIEngine);

    // AIRecommendationEngine.generateRecommendation が呼び出されたことを確認
    expect(mockAIEngine.generateRecommendation).toHaveBeenCalled();

    // 呼び出し時の引数を取得
    const callArgs = mockAIEngine.generateRecommendation.mock.calls[0][0];

    // 改善優先度ランク条件が引数に含まれていないことを確認
    expect(callArgs).toEqual(
      expect.objectContaining({
        customerIndustry: "製造業",
        companyScale: "大企業",
        dealStage: "提案準備段階",
      })
    );
    expect(callArgs.improvementPriorityRank).toBeUndefined();

    // 最終的に生成された営業指導方針が、ランク基準による判定を適用していないことを確認
    expect(result).toEqual(
      expect.objectContaining({
        recommendedApproach: "顧客業種と商談ステージに基づいた標準提案パターンA",
        confidenceScore: 78,
        reasoning: expect.objectContaining({
          rankBasedFilteringApplied: false,
          appliedFilters: ["customerIndustry", "companyScale", "dealStage"],
        }),
      })
    );

    // ランク基準が結果のペイロードに含まれていないことを確認
    expect(result.reasoning.rankBasedFilteringApplied).toBe(false);
  });
});