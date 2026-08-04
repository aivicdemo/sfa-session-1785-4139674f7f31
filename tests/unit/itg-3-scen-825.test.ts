import { calculateTrustScoreAndExplain } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェントの推奨根拠の可視化機能", () => {
  // SCEN-825
  test("followUpSuccessPatterns が空配列のとき、エラーで処理が進まない", () => {
    const mockAIRecommendationEngine = {
      findSimilarPatterns: jest.fn().mockResolvedValue({
        followUpSuccessPatterns: [],
      }),
    };

    const dealCondition = {
      customerIndustry: "製造業",
      productCategory: "システム導入",
      budgetSize: 5000000,
      dealStage: "提案",
    };

    expect(
      async () =>
        await calculateTrustScoreAndExplain(
          dealCondition,
          mockAIRecommendationEngine
        )
    ).rejects.toThrow(/フォローアップ成功パターンデータ/);
  });
});