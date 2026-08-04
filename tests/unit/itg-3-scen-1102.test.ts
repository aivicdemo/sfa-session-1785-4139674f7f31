import { explainRecommendationReasoning } from "../../src/logic/it-1-br-3-2-1-1";

describe("AIエージェント推奨内容の根拠表示機能", () => {
  // SCEN-1102
  test("推奨根拠の信頼度スコアが null のとき、根拠表示処理がエラーになる", () => {
    const recommendationId = "rec-001";
    const patternId = "pat-001";
    const proposalApproach = "顧客ニーズに基づく段階的提案";

    const recommendationWithNullScore = {
      recommendationId,
      patternId,
      proposalApproach,
      confidenceScore: null,
      customerAttributes: {
        industry: "IT",
        companySize: "medium",
      },
      successPatterns: [
        {
          patternId: "pat-001",
          description: "既存顧客からの追加提案成功",
          frequency: 15,
        },
      ],
    };

    expect(() =>
      explainRecommendationReasoning(recommendationWithNullScore)
    ).toThrow(/信頼度スコア/);
  });
});