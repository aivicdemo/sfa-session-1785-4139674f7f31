import { explainRecommendationReasoning } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェントの推奨根拠の可視化機能", () => {
  // SCEN-057
  test("推奨内容IDが未設定の場合に説明生成が正常に実行される", () => {
    const mockAIEngine = {
      explainRecommendationReasoning: jest.fn(
        (recommendation: { recommendationId: string | null; reason: string }) =>
          "この推奨は過去の成功パターンに基づいています。顧客の業種と規模が類似した過去事例では、このアプローチで73%の採用率を達成しています。"
      ),
    };

    const recommendationWithoutId = {
      recommendationId: null,
      reason: "顧客の購買シグナルが検出されました",
    };

    const result = explainRecommendationReasoning(
      recommendationWithoutId,
      mockAIEngine
    );

    expect(mockAIEngine.explainRecommendationReasoning).toHaveBeenCalledWith(
      recommendationWithoutId
    );
    expect(typeof result).toBe("string");
    expect(result.length).toBeGreaterThanOrEqual(1);
    expect(result).toBe(
      "この推奨は過去の成功パターンに基づいています。顧客の業種と規模が類似した過去事例では、このアプローチで73%の採用率を達成しています。"
    );
  });
});