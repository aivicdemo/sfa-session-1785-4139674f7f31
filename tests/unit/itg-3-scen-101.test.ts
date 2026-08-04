import { generateRecommendation } from "../../src/logic/it-1-br-3-3-2-1";

describe("AIエージェント推奨支援システム - 新規案件推奨生成", () => {
  test("SCEN-101: 顧客IDが空のとき推論実行が拒否される", () => {
    const mockAIEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const input = {
      customerId: "",
      dealCondition: "expansion",
      industry: "manufacturing",
      companySize: "large",
      aiRecommendationEngine: mockAIEngine,
    };

    expect(() => generateRecommendation(input)).toThrow(/顧客ID/);
    expect(mockAIEngine.generateRecommendation).not.toHaveBeenCalled();
  });
});