import { visualizeRecommendationReasoning } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェントの推奨根拠の可視化機能", () => {
  test("SCEN-1573: [error] 推奨根拠の説明文が空のとき、エラーが発生する", () => {
    const recommendationId = "REC-20240115-001";
    const emptyReasoningText = "";

    const mockAIEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn().mockReturnValue(emptyReasoningText),
      evaluatePatternRelevance: jest.fn(),
    };

    expect(() => {
      visualizeRecommendationReasoning(recommendationId, mockAIEngine);
    }).toThrow(/推奨根拠の説明文が空/);
  });
});