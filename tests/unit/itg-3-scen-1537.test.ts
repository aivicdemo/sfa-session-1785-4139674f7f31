import { visualizeRecommendationReasoning } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェントの推奨根拠の可視化機能", () => {
  // SCEN-1537
  test("推奨根拠が外部AI呼び出しの正常応答で可視化される", () => {
    const mockAIEngine = {
      explainRecommendationReasoning: jest.fn().mockResolvedValue({
        reasoning:
          "顧客の業界は製造業で、過去成功事例との類似度が85%です。同業界での提案アプローチAが成約率78%を実現しており、推奨します。",
      }),
    };

    const newDealData = {
      customerIndustry: "製造業",
      dealStage: "提案前",
      budgetAmount: 5000000,
    };

    const result = visualizeRecommendationReasoning(newDealData, mockAIEngine);

    expect(mockAIEngine.explainRecommendationReasoning).toHaveBeenCalledWith(
      newDealData
    );
    expect(result.reasoning).toBe(
      "顧客の業界は製造業で、過去成功事例との類似度が85%です。同業界での提案アプローチAが成約率78%を実現しており、推奨します。"
    );
    expect(result.isRendered).toBe(true);
    expect(result.format).toBe("text");
  });
});