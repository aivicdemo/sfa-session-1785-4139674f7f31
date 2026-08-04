import { evaluatePatternRelevance } from "../../src/logic/it-1-br-3-3-2-1";

describe("成功パターン自動判定機能", () => {
  // SCEN-2656: [edge] 成功パターン自動判定機能 - 成功パターンテンプレートが1件のとき、その1件が判定対象として処理される
  test("成功パターンテンプレートが1件のみ登録されている場合、その1件が判定対象として処理される", () => {
    const singleTemplate = {
      templateId: "TPL001",
      patternName: "大規模企業向け提案",
      customerScale: "large",
      industry: "製造業",
      budgetRange: "1000万円以上",
      successRate: 0.82,
    };

    const newDealData = {
      customerId: "CUST-2024-001",
      customerScale: "large",
      industry: "製造業",
      estimatedBudget: 15000000,
      dealStage: "初期接触",
    };

    const mockAIEngine = {
      findSimilarPatterns: jest.fn().mockResolvedValue([singleTemplate]),
      generateRecommendation: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn().mockResolvedValue({
        templateId: "TPL001",
        relevanceScore: 85,
        isApplicable: true,
        confidenceLevel: 0.85,
      }),
    };

    const result = evaluatePatternRelevance(
      [singleTemplate],
      newDealData,
      mockAIEngine
    );

    expect(mockAIEngine.evaluatePatternRelevance).toHaveBeenCalledTimes(1);
    expect(mockAIEngine.evaluatePatternRelevance).toHaveBeenCalledWith(
      singleTemplate,
      newDealData
    );

    expect(result).toEqual({
      recommendedPatterns: [
        {
          templateId: "TPL001",
          patternName: "大規模企業向け提案",
          relevanceScore: 85,
          isApplicable: true,
          confidenceLevel: 0.85,
        },
      ],
      totalCount: 1,
      processingStatus: "completed",
    });

    expect(result.recommendedPatterns.length).toBe(1);
    expect(result.totalCount).toBe(1);
    expect(result.recommendedPatterns[0].templateId).toBe("TPL001");
  });
});