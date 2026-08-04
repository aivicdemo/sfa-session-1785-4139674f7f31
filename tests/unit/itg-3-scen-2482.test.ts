import { explainRecommendationReasoning } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェントの推奨根拠の可視化機能", () => {
  // SCEN-2482
  test("推奨根拠の自然言語説明生成機能 - OpenAI APIが正常応答し、営業担当者向けに自然言語で根拠説明が生成される", async () => {
    const mockAIEngine = {
      explainRecommendationReasoning: jest.fn().mockResolvedValue({
        reasoning:
          "この顧客はIT予算が潤沢で、過去3年間の同業他社との成功事例では、クラウド移行提案が78%の成約率を達成しています。顧客の現在のオンプレミス環境と貴社のクラウド基盤は技術的親和性が高く、導入期間も6ヶ月と短縮可能です。",
        confidence: 0.92,
        relatedSuccessPatterns: ["パターンA", "パターンB"],
      }),
    };

    const recommendationCase = {
      customerId: "CUST-20240115-001",
      industry: "金融",
      budgetScale: "large",
      currentITEnvironment: "onPremise",
      proposalType: "cloudMigration",
    };

    const result = await explainRecommendationReasoning(
      recommendationCase,
      mockAIEngine
    );

    expect(result.reasoning).toBe(
      "この顧客はIT予算が潤沢で、過去3年間の同業他社との成功事例では、クラウド移行提案が78%の成約率を達成しています。顧客の現在のオンプレミス環境と貴社のクラウド基盤は技術的親和性が高く、導入期間も6ヶ月と短縮可能です。"
    );
    expect(result.confidence).toBe(0.92);
    expect(result.relatedSuccessPatterns).toEqual([
      "パターンA",
      "パターンB",
    ]);
    expect(result.relatedSuccessPatterns.length).toBe(2);

    expect(mockAIEngine.explainRecommendationReasoning).toHaveBeenCalledWith(
      recommendationCase
    );
    expect(mockAIEngine.explainRecommendationReasoning).toHaveBeenCalledTimes(
      1
    );
  });
});