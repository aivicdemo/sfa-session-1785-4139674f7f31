import { explainRecommendationReasoning } from "../../src/logic/it-1-br-3-2-1-1";

describe("AIエージェント推奨内容の根拠表示機能", () => {
  test("SCEN-2685: 推奨内容の生成根拠が欠落しているとき、根拠表示として「詳細情報なし」が出力される", () => {
    const mockAIEngine = {
      explainRecommendationReasoning: jest.fn().mockReturnValue(""),
    };

    const recommendationId = "REC-2685";
    const dealData = {
      recommendationId: recommendationId,
      customerId: "CUST-001",
      dealAmount: 500000,
      dealStage: "proposal",
    };

    const result = explainRecommendationReasoning(dealData, mockAIEngine);

    expect(result.displayText).toBe("詳細情報なし");
    expect(result.dataTestId).toBe("reasoning-empty-state");
    expect(result.cssClass).toBe("reasoning-placeholder");
    expect(result.isEmpty).toBe(true);
  });
});