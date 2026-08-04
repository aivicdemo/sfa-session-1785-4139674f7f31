import { generateRecommendationForNewDeal } from "../../src/logic/it-1-br-3-3-2-1";

describe("成功パターン抽出・推奨機能", () => {
  // SCEN-667
  test("過去商談データが1件のとき、そのパターンに基づいた推奨アプローチを生成する", () => {
    // 過去の成功事例データ
    const pastSuccessDeal = {
      customerSize: "中堅企業",
      industry: "製造業",
      challenge: "生産効率化",
      recommendedApproach: "IoTセンサー導入による可視化",
      contractAmount: 5000000,
      durationMonths: 3,
    };

    // 新規案件データ
    const newDeal = {
      customerSize: "中堅企業",
      industry: "製造業",
      challenge: "生産効率化",
    };

    // AIRecommendationEngine のスタブ
    const aiRecommendationEngineStub = {
      generateRecommendation: jest.fn().mockReturnValue({
        recommendedApproach: "IoTセンサー導入による生産効率化の可視化",
        reasoning:
          "過去の同一業種・課題の成功事例に基づき、IoTセンサー導入による可視化を推奨します",
      }),
      findSimilarPatterns: jest.fn().mockReturnValue({
        patterns: [
          {
            id: 1,
            similarity: 0.85,
            deal: pastSuccessDeal,
          },
        ],
        similarPatternCount: 1,
      }),
      evaluatePatternRelevance: jest.fn().mockReturnValue({
        relevanceScore: 0.82,
        isApplicable: true,
      }),
      explainRecommendationReasoning: jest.fn().mockReturnValue(
        "過去の同一業種・課題の成功事例に基づき、IoTセンサー導入による可視化を推奨します"
      ),
    };

    // テスト対象の関数を実行
    const result = generateRecommendationForNewDeal(
      newDeal,
      aiRecommendationEngineStub
    );

    // 戻り値の検証
    expect(result.recommendedApproach).toBe(
      "IoTセンサー導入による生産効率化の可視化"
    );
    expect(result.similarPatternCount).toBe(1);
    expect(result.relevanceScore).toBe(0.82);
    expect(result.relevanceScore).toBeGreaterThanOrEqual(0.8);
    expect(result.reasoning).toBe(
      "過去の同一業種・課題の成功事例に基づき、IoTセンサー導入による可視化を推奨します"
    );
    expect(result.estimatedDuration).toBe(3);
    expect(result.pastSuccessAmount).toBe(5000000);

    // スタブの呼び出し確認
    expect(aiRecommendationEngineStub.findSimilarPatterns).toHaveBeenCalledTimes(
      1
    );
    expect(
      aiRecommendationEngineStub.evaluatePatternRelevance
    ).toHaveBeenCalledTimes(1);
  });
});