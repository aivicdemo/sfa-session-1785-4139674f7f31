import { explainRecommendationReasoning } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェントの推奨根拠の可視化機能", () => {
  // SCEN-1677
  test("根拠テキストが空文字列のとき、ValidationErrorが発生する", () => {
    const mockAIEngine = {
      explainRecommendationReasoning: jest.fn().mockReturnValue(""),
    };

    const emptyReasoningText = mockAIEngine.explainRecommendationReasoning();

    expect(() => {
      explainRecommendationReasoning(emptyReasoningText);
    }).toThrow(/根拠情報/);
  });
});