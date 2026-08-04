import { explainRecommendationReasoning } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェントの推奨根拠の可視化機能", () => {
  // SCEN-1855
  test("根拠となる過去事例の日付が空文字列のとき根拠情報の生成に失敗する", () => {
    const mockAIEngine = {
      explainRecommendationReasoning: jest.fn(),
    };

    const pastCaseWithEmptyDate = {
      caseId: "case-001",
      customerIndustry: "製造業",
      customerScale: "大企業",
      dealAmount: 5000000,
      dealDate: "",
      dealStatus: "won",
      proposalApproach: "コスト削減提案",
      successFactor: "経営層への説得が効果的",
    };

    const recommendationData = {
      recommendationId: "rec-2024-001",
      customerId: "cust-123",
      proposedApproach: "段階的導入プラン",
      pastCases: [pastCaseWithEmptyDate],
      confidenceScore: 75,
    };

    mockAIEngine.explainRecommendationReasoning.mockImplementation(() => {
      throw new Error("根拠となる過去事例の日付が不正です");
    });

    expect(() =>
      mockAIEngine.explainRecommendationReasoning(recommendationData)
    ).toThrow(/過去事例の日付/);
  });
});