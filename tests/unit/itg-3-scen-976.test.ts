import { displayRecommendationReasoning } from "../../src/logic/it-1-br-3-2-1-1";

describe("AIエージェント推奨内容の根拠表示機能", () => {
  // SCEN-976
  test("成功パターンの適用可能度スコアが負数のとき、不正値エラーが返される", () => {
    const mockAIRecommendationEngine = {
      evaluatePatternRelevance: jest.fn().mockResolvedValue({
        applicabilityScore: -0.5,
        patternId: "pattern-001",
      }),
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
    };

    const successPatternId = "pattern-001";
    const newProjectConditions = {
      customerIndustry: "manufacturing",
      customerSize: "large",
      dealAmount: 5000000,
      dealStage: "proposal",
    };

    expect(() =>
      displayRecommendationReasoning(
        successPatternId,
        newProjectConditions,
        mockAIRecommendationEngine
      )
    ).toThrow(/適用可能度スコア/);
  });
});