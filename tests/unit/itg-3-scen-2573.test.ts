import { explainRecommendationReasoning } from "../../src/logic/it-1-br-3-2-1-1";

describe("AIエージェント推奨内容の根拠表示機能", () => {
  // SCEN-2573
  test("推奨内容の根拠表示機能 - 根拠の有効期限が本日前のとき、表示されない", () => {
    const today = new Date("2026-01-15T00:00:00Z");
    const expirationDate = new Date("2026-01-14T23:59:59Z");

    const recommendationId = "REC-001";
    const recommendationContent = "顧客セグメントA向け提案アプローチ";
    const reasoningBasis = "過去成功事例との類似度85%";

    const recommendationData = {
      recommendationId: recommendationId,
      content: recommendationContent,
      basis: reasoningBasis,
      expirationDate: expirationDate.toISOString(),
    };

    const mockAIEngine = {
      explainRecommendationReasoning: jest.fn(),
    };

    const result = explainRecommendationReasoning(
      recommendationData,
      today,
      mockAIEngine
    );

    expect(result.contentDisplayed).toBe(true);
    expect(result.content).toBe(recommendationContent);
    expect(result.reasoningDisplayed).toBe(false);
    expect(result.reasoningMessage).toBe("根拠情報が利用できません");
    expect(mockAIEngine.explainRecommendationReasoning).not.toHaveBeenCalled();
  });
});