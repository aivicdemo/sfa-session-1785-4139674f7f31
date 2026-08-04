import { explainRecommendationReasoning } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェントの推奨根拠の可視化機能", () => {
  // SCEN-892
  test("推奨説明が正常に生成されたとき自然言語による根拠説明が営業担当者に提示される", () => {
    const stubAIEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendedApproach: "顧客のコスト削減ニーズに対して段階的導入プランを提案",
        confidenceScore: 0.92,
        similarSuccessPatternIds: ["PATTERN_2024_001", "PATTERN_2024_005"],
      }),
      explainRecommendationReasoning: jest.fn().mockResolvedValue(
        "過去24ヶ月間の類似案件データから、同業界の企業でコスト削減を主目的とした案件において、段階的導入プランを採用した場合の成約率が83%に達しています。御社の顧客も同様の業界属性・予算規模を持つため、このアプローチが有効と判定されました。"
      ),
    };

    const newDealData = {
      customerIndustry: "製造業",
      dealAmount: "5000万円",
      mainChallenge: "オペレーション効率化",
    };

    const expectedExplanation =
      "過去24ヶ月間の類似案件データから、同業界の企業でコスト削減を主目的とした案件において、段階的導入プランを採用した場合の成約率が83%に達しています。御社の顧客も同様の業界属性・予算規模を持つため、このアプローチが有効と判定されました。";

    const result = explainRecommendationReasoning(
      stubAIEngine,
      newDealData,
      "段階的導入プラン",
      0.92
    );

    expect(result).toBe(expectedExplanation);
    expect(result).toContain("段階的導入プラン");
    expect(result).toContain("83%");
  });
});