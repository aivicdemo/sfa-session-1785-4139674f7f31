import { evaluatePatternRelevance } from "../../src/logic/it-1-br-3-3-2-1";

describe("商談条件照合評価 - デフォルトパターン適用", () => {
  // SCEN-1031
  test("商談条件が0件の場合、デフォルト照合ルールが適用される", () => {
    const mockDealConditions: never[] = [];

    const mockRecommendationEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const defaultSuccessPatterns = [
      {
        pattern_id: "PST_001",
        success_rate: 0.85,
        description: "標準提案アプローチ - 大規模企業向け",
      },
      {
        pattern_id: "PST_002",
        success_rate: 0.78,
        description: "標準提案アプローチ - 中堅企業向け",
      },
      {
        pattern_id: "PST_003",
        success_rate: 0.72,
        description: "標準提案アプローチ - 小規模企業向け",
      },
    ];

    const newDealData = {
      customer_id: "CUST_20240115_001",
      customer_name: "Sample Corporation",
      industry: "manufacturing",
      company_size: "large",
      budget: 5000000,
      deal_stage: "initial_contact",
    };

    const result = evaluatePatternRelevance(
      newDealData,
      mockDealConditions,
      defaultSuccessPatterns,
      mockRecommendationEngine
    );

    expect(result.rule_application_type).toBe("DEFAULT_PATTERN");
    expect(result.applied_patterns).toHaveLength(3);
    expect(result.applied_patterns[0].pattern_id).toBe("PST_001");
    expect(result.applied_patterns[0].success_rate).toBe(0.85);
    expect(result.applied_patterns[1].pattern_id).toBe("PST_002");
    expect(result.applied_patterns[1].success_rate).toBe(0.78);
    expect(result.applied_patterns[2].pattern_id).toBe("PST_003");
    expect(result.applied_patterns[2].success_rate).toBe(0.72);
    expect(result.explanation).toMatch(/過去の成功事例に基づくデフォルトパターン/);
    expect(mockRecommendationEngine.findSimilarPatterns).not.toHaveBeenCalled();
    expect(result.relevance_score).toBe(0);
  });
});