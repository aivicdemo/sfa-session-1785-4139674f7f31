import { explainRecommendationReasoningWithFallback } from "../../src/logic/it-1-br-3-2-1-1";

describe("AIエージェント推奨内容の根拠表示機能", () => {
  // SCEN-280
  test("推奨根拠が0件のとき、デフォルトの根拠テンプレートが表示される", () => {
    const mockAIEngine = {
      explainRecommendationReasoning: jest.fn().mockResolvedValue([]),
    };

    const mockPatternMaster = [
      {
        patternId: "pattern_001",
        description:
          "過去の成功事例と顧客プロフィールの類似度が高いため、このアプローチが推奨されます",
        frequency: 45,
      },
      {
        patternId: "pattern_002",
        description: "顧客の業種別成功パターンに基づいた提案です",
        frequency: 32,
      },
      {
        patternId: "pattern_003",
        description: "類似企業規模での購買実績から推奨する提案内容です",
        frequency: 18,
      },
    ];

    const recommendationInput = {
      customerId: "CUST_20240115_001",
      customerIndustry: "製造業",
      customerScale: "大企業",
      dealConditions: {
        productCategory: "デジタル変革支援",
        budgetRange: "5000万円以上",
        decisionTimeline: "90日以内",
      },
      salesStageCode: "提案段階",
    };

    const result = explainRecommendationReasoningWithFallback(
      recommendationInput,
      mockAIEngine,
      mockPatternMaster
    );

    expect(result).not.toBeNull();
    expect(result).not.toBeUndefined();
    expect(result.length).toBeGreaterThan(0);
    expect(result).toContain("過去の成功事例と顧客プロフィールの類似度が高いため");
    expect(result).toContain("このアプローチが推奨されます");
    expect(mockAIEngine.explainRecommendationReasoning).toHaveBeenCalledWith(
      recommendationInput
    );
  });
});