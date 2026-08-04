import { explainRecommendationReasoning } from "../../src/logic/it-1-br-3-2-1-1";

describe("AIエージェント推奨内容の根拠表示機能", () => {
  // SCEN-1769
  test("根拠説明文が空文字のとき根拠表示内容を空で返す", () => {
    const mockAIEngine = {
      explainRecommendationReasoning: jest.fn().mockReturnValue(""),
    };

    const recommendationId = "rec-12345";
    const result = explainRecommendationReasoning(
      recommendationId,
      mockAIEngine
    );

    expect(result).toBe("");
  });
});