import { explainRecommendationReasoning } from "../../src/logic/it-1-br-3-2-1-1";

describe("AIエージェント推奨内容の根拠表示機能", () => {
  // SCEN-2562: [edge] 推奨内容の根拠表示機能 - 推奨内容が0件のとき、根拠が表示されない
  test("推奨内容が0件の場合、根拠説明が呼び出されず表示されない", () => {
    const mockAIEngine = {
      explainRecommendationReasoning: jest.fn(),
    };

    const recommendationsEmpty = [];
    const recommendationId = "rec-001";

    const result = explainRecommendationReasoning(
      recommendationsEmpty,
      recommendationId,
      mockAIEngine
    );

    expect(mockAIEngine.explainRecommendationReasoning).not.toHaveBeenCalled();
    expect(result).toEqual({
      reasoningText: "",
      isDisplayed: false,
    });
  });
});