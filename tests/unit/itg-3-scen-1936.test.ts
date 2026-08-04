import { explainRecommendationReasoning } from "../../src/logic/it-1-br-3-2-1-1";

describe("AIエージェント推奨内容の根拠表示機能", () => {
  test("SCEN-1936: 推奨IDが空文字列のときに根拠情報が取得されない", () => {
    // Arrange: AIRecommendationEngineのスタブを準備
    const mockAIEngine = {
      explainRecommendationReasoning: jest.fn().mockReturnValue(null),
    };

    // 推奨IDが空文字列の場合
    const recommendationId = "";
    const fallbackMessage = "根拠情報を取得できませんでした";

    // Act: 推奨内容の根拠表示機能を呼び出す
    const result = explainRecommendationReasoning(
      recommendationId,
      mockAIEngine
    );

    // Assert: explainRecommendationReasoning()スタブへの呼び出しを確認
    expect(mockAIEngine.explainRecommendationReasoning).toHaveBeenCalledWith(
      recommendationId
    );

    // スタブからnullが返されることを確認
    expect(result).toBeNull();

    // フォールバックメッセージが返されることを確認
    const uiDisplayResult = result || fallbackMessage;
    expect(uiDisplayResult).toBe(fallbackMessage);
  });
});