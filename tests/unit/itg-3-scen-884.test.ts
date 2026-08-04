import { describe, test, expect, beforeEach } from "@jest/globals";
import { presentRecommendationRationale } from "../../src/logic/it-1-br-3-2-1-1";

describe("AIエージェント推奨内容の根拠表示機能", () => {
  // SCEN-884
  test("推奨根拠データが複数件のとき複数の根拠がすべて営業担当者に提示される", () => {
    const mockAIEngine = {
      findSimilarPatterns: jest.fn().mockReturnValue([
        {
          patternId: "PATTERN-001",
          industry: "manufacturing",
          successRate: 75,
        },
        {
          patternId: "PATTERN-002",
          budgetMin: 1000000,
          budgetMax: 1500000,
          successRate: 80,
        },
        {
          patternId: "PATTERN-003",
          implementationDays: 90,
          successRate: 72,
        },
      ]),
      explainRecommendationReasoning: jest.fn((patternId: string) => {
        const explanations: Record<string, string> = {
          "PATTERN-001":
            "顧客の業界が製造業で、過去同業での成約率は75%",
          "PATTERN-002":
            "提案金額帯が100万円以上150万円以下の事例で成約率80%",
          "PATTERN-003":
            "導入期間が3ヶ月以内の案件で成約率72%",
        };
        return explanations[patternId] || "";
      }),
    };

    const testInput = {
      customerId: "CUST-12345",
      customerIndustry: "manufacturing",
      budgetAmount: 1200000,
      implementationDays: 60,
      aiEngine: mockAIEngine,
    };

    const result = presentRecommendationRationale(testInput);

    expect(mockAIEngine.findSimilarPatterns).toHaveBeenCalledWith(
      expect.objectContaining({
        industry: "manufacturing",
        budget: 1200000,
        implementationDays: 60,
      })
    );

    expect(result.rationales).toBeDefined();
    expect(Array.isArray(result.rationales)).toBe(true);
    expect(result.rationales).toHaveLength(3);

    expect(result.rationales[0]).toEqual({
      patternId: "PATTERN-001",
      explanation: "顧客の業界が製造業で、過去同業での成約率は75%",
      relevanceScore: 75,
    });

    expect(result.rationales[1]).toEqual({
      patternId: "PATTERN-002",
      explanation:
        "提案金額帯が100万円以上150万円以下の事例で成約率80%",
      relevanceScore: 80,
    });

    expect(result.rationales[2]).toEqual({
      patternId: "PATTERN-003",
      explanation: "導入期間が3ヶ月以内の案件で成約率72%",
      relevanceScore: 72,
    });

    const uiElements = result.renderUiElements();
    expect(uiElements).toBeDefined();
    expect(uiElements.length).toBe(3);

    uiElements.forEach((element, index) => {
      expect(element.patternId).toBe(result.rationales[index].patternId);
      expect(element.explanation).toBe(result.rationales[index].explanation);
      expect(element.relevanceScore).toBe(result.rationales[index].relevanceScore);
      expect(element.isVisible).toBe(true);
    });

    expect(mockAIEngine.explainRecommendationReasoning).toHaveBeenCalledTimes(3);
    expect(mockAIEngine.explainRecommendationReasoning).toHaveBeenNthCalledWith(
      1,
      "PATTERN-001"
    );
    expect(mockAIEngine.explainRecommendationReasoning).toHaveBeenNthCalledWith(
      2,
      "PATTERN-002"
    );
    expect(mockAIEngine.explainRecommendationReasoning).toHaveBeenNthCalledWith(
      3,
      "PATTERN-003"
    );
  });
});