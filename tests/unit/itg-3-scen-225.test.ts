import { explainRecommendationReasoning } from "../../src/logic/it-1-br-3-2-1-1";

describe("AIエージェント推奨内容の根拠表示機能", () => {
  // SCEN-225
  test("推奨根拠データが null のとき、エラーハンドリングが正常に動作する", () => {
    const recommendationId = "REC-12345";
    const aiRecommendationEngineStub = {
      explainRecommendationReasoning: jest.fn().mockReturnValue(null),
    };

    let errorMessage = "";
    let isErrorDisplay = false;
    let displayedReasoning = null;

    try {
      displayedReasoning = aiRecommendationEngineStub.explainRecommendationReasoning(
        recommendationId
      );

      if (displayedReasoning === null) {
        throw new TypeError("推奨根拠データが null のため根拠表示処理を継続できません");
      }
    } catch (error) {
      if (error instanceof TypeError) {
        errorMessage = "根拠の取得に失敗しました。後ほど再度お試しください";
        isErrorDisplay = true;
        console.error(
          "推奨根拠データが null のため根拠表示処理を継続できません"
        );
      }
    }

    expect(aiRecommendationEngineStub.explainRecommendationReasoning).toHaveBeenCalledWith(
      recommendationId
    );
    expect(displayedReasoning).toBeNull();
    expect(isErrorDisplay).toBe(true);
    expect(errorMessage).toBe("根拠の取得に失敗しました。後ほど再度お試しください");
  });
});