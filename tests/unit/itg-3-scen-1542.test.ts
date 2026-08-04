import { displayRecommendationReasoning } from "../../src/logic/it-1-br-3-2-1-1";

describe("AIエージェント推奨内容の根拠表示機能", () => {
  // SCEN-1542
  test("適用可能な成功パターンが0件の場合、「該当する根拠がありません」の旨が表示される", () => {
    const mockAIRecommendationEngine = {
      findSimilarPatterns: jest.fn().mockResolvedValue([]),
      evaluatePatternRelevance: jest.fn().mockResolvedValue([]),
      generateRecommendation: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
    };

    const newCaseData = {
      customerIndustry: "IT",
      caseScale: "medium",
      decisionMakerCount: 2,
      budgetRange: "1M-5M",
    };

    const result = displayRecommendationReasoning(
      newCaseData,
      mockAIRecommendationEngine
    );

    expect(result.message).toBe("該当する根拠がありません");
    expect(result.foundPatterns).toEqual([]);
    expect(result.reasoningDetails).toEqual([]);
    expect(result.successPatternDetails).toBeUndefined();
  });
});