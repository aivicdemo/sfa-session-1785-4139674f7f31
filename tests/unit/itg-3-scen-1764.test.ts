import { explainRecommendationReasoning } from "../../src/logic/it-1-br-3-2-1-1";

describe("AIエージェント推奨内容の根拠表示機能", () => {
  // SCEN-1764: [edge] 推奨内容の根拠表示機能 - 推奨内容が1件のとき根拠表示内容に1要素を含めて返す
  test("推奨内容が1件のとき、根拠表示内容に1要素を含めて返す", () => {
    const mockAIEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendations: [
          {
            id: "rec-001",
            customerIndustry: "製造業",
            customerScale: "従業員500名",
            dealCondition: "新規受注型案件",
            successPatternName: "製造業向け大型受注パターン",
            matchScore: 0.87,
          },
        ],
      }),
      explainRecommendationReasoning: jest.fn().mockResolvedValue({
        reasoningDetails: [
          {
            customerAttribute: "製造業、従業員500名規模",
            dealCondition: "新規受注型案件",
            successPatternName: "製造業向け大型受注パターン",
            matchScore: 0.87,
            explanation:
              "過去の類似案件において、製造業向けの新規受注型案件では初期接触時の経営層への提案が成功要因となっています。本案件も同様の条件を満たしているため、このパターンを推奨します。",
          },
        ],
      }),
    };

    const input = {
      recommendationId: "rec-001",
      customerIndustry: "製造業",
      customerScale: "従業員500名",
      dealCondition: "新規受注型案件",
      successPatternName: "製造業向け大型受注パターン",
      matchScore: 0.87,
    };

    const result = explainRecommendationReasoning(input, mockAIEngine);

    expect(result).toHaveProperty("reasoningDetails");
    expect(Array.isArray(result.reasoningDetails)).toBe(true);
    expect(result.reasoningDetails.length).toBe(1);

    const reasoningElement = result.reasoningDetails[0];
    expect(reasoningElement).toHaveProperty("customerAttribute");
    expect(reasoningElement).toHaveProperty("dealCondition");
    expect(reasoningElement).toHaveProperty("successPatternName");
    expect(reasoningElement).toHaveProperty("matchScore");
    expect(reasoningElement).toHaveProperty("explanation");

    expect(reasoningElement.customerAttribute).toBe("製造業、従業員500名規模");
    expect(reasoningElement.dealCondition).toBe("新規受注型案件");
    expect(reasoningElement.successPatternName).toBe(
      "製造業向け大型受注パターン"
    );
    expect(reasoningElement.matchScore).toBe(0.87);
    expect(typeof reasoningElement.explanation).toBe("string");
    expect(reasoningElement.explanation.length).toBeGreaterThan(0);
    expect(
      reasoningElement.explanation.includes("製造業") &&
        reasoningElement.explanation.includes("新規受注型案件")
    ).toBe(true);
  });
});