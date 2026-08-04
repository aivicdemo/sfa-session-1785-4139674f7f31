import { calculateInferenceAccuracyScore } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェントの推奨根拠の可視化機能", () => {
  test("SCEN-2383: 推論結果オブジェクトがnullのとき、エラーが発生する", () => {
    const mockAIEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    mockAIEngine.generateRecommendation.mockReturnValue(null);

    expect(() => {
      calculateInferenceAccuracyScore(mockAIEngine.generateRecommendation());
    }).toThrow(/推論結果/);
  });
});