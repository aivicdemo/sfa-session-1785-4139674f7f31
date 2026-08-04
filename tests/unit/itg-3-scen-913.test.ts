import { generateRecommendation } from "../../src/logic/it-1-br-3-3-2-1";

describe("提案アプローチ推奨機能", () => {
  // SCEN-913
  test("照合対象の提案アプローチが1件のとき単一アプローチが推奨される", async () => {
    // モック用のAIRecommendationEngine
    const mockAIEngine = {
      findSimilarPatterns: jest.fn().mockResolvedValue([
        {
          relevanceScore: 0.95,
          approachName: "顧客課題ヒアリング型提案",
          successRate: 0.87,
          approachId: "approach_001",
          description: "顧客の経営課題を深掘りするヒアリング型アプローチ",
        },
      ]),
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendationType: "SINGLE",
        recommendedApproaches: [
          {
            approachName: "顧客課題ヒアリング型提案",
            successRate: 0.87,
            relevanceScore: 0.95,
            approachId: "approach_001",
          },
        ],
        reasoning:
          "貴社の顧客は製造業でデジタル化推進が重要課題です。同業種で成功率87%の顧客課題ヒアリング型提案が最適です。予算規模500万円内での実装が可能です。",
        confidenceScore: 92,
      }),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    // 新規案件データ
    const newDealData = {
      customerIndustry: "製造業",
      dealChallenge: "デジタル化推進",
      budgetSize: 5000000,
      dealId: "deal_20240915_001",
      customerName: "ABC製造株式会社",
      dealStage: "初期提案",
    };

    // 提案アプローチ推奨機能を実行
    const result = await generateRecommendation(newDealData, mockAIEngine);

    // 推奨結果の構造を検証
    expect(result).toBeDefined();
    expect(result.recommendationType).toBe("SINGLE");

    // recommendedApproachesが配列で1件のみ格納されていることを確認
    expect(Array.isArray(result.recommendedApproaches)).toBe(true);
    expect(result.recommendedApproaches).toHaveLength(1);

    // 推奨結果のrecommendedApproaches[0]に期待する情報が格納されていることを検証
    expect(result.recommendedApproaches[0]).toBeDefined();
    expect(result.recommendedApproaches[0].approachName).toBe(
      "顧客課題ヒアリング型提案"
    );
    expect(result.recommendedApproaches[0].successRate).toBe(0.87);
    expect(result.recommendedApproaches[0].relevanceScore).toBe(0.95);

    // 推奨根拠説明（reasoning）が存在し、空文字列でないことを検証
    expect(result.reasoning).toBeDefined();
    expect(typeof result.reasoning).toBe("string");
    expect(result.reasoning.length).toBeGreaterThan(0);

    // 信頼度スコアが0-100の範囲内であることを検証
    expect(result.confidenceScore).toBeGreaterThanOrEqual(0);
    expect(result.confidenceScore).toBeLessThanOrEqual(100);

    // モックが正しく呼び出されたことを確認
    expect(mockAIEngine.findSimilarPatterns).toHaveBeenCalledWith(newDealData);
    expect(mockAIEngine.generateRecommendation).toHaveBeenCalled();
  });
});