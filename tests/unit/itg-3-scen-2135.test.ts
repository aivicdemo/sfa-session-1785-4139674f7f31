import { explainRecommendationReasoning } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェントの推奨根拠の可視化機能", () => {
  // SCEN-2135
  test("推奨内容が null のとき、エラーが発生する", () => {
    const mockAIEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn((recommendation: unknown) => {
        if (recommendation === null) {
          throw new Error("recommendation must not be null");
        }
        return "Mocked explanation";
      }),
      evaluatePatternRelevance: jest.fn(),
    };

    expect(() =>
      explainRecommendationReasoning(null, mockAIEngine)
    ).toThrow(/recommendation must not be null/);
  });
});