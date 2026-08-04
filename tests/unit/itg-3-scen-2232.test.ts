import { generateRecommendation } from "../../src/logic/it-1-br-3-3-2-1";

describe("成功パターン抽出と提案アプローチ推奨機能", () => {
  // SCEN-2232
  test("[normal] OpenAI API呼び出しが正常応答したとき推奨内容が生成される", async () => {
    const mockAIEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendedApproach:
          "顧客の既存システム統合を軸とした段階的な提案アプローチ",
        reasoning:
          "同規模SaaS企業への過去3件の成功事例から、段階的統合が採用率を70%向上させた実績に基づく推奨",
        relevanceScore: 0.82,
        similarPatternId: "pattern_20240115_001",
      }),
    };

    const newDealInput = {
      customerId: "cust_20240115_001",
      customerIndustry: "SaaS",
      customerSize: "mid-market",
      dealStage: "proposal_preparation",
      dealValue: 500000,
      dealTimeline: 90,
      customerChallenges: [
        "システム統合",
        "運用効率化",
        "コスト削減",
      ],
      competitorPresence: true,
      decisionMakerLevel: "director",
    };

    const result = await generateRecommendation(newDealInput, mockAIEngine);

    expect(result).toBeDefined();
    expect(result.recommendedApproach).toBe(
      "顧客の既存システム統合を軸とした段階的な提案アプローチ"
    );
    expect(result.reasoning).toBe(
      "同規模SaaS企業への過去3件の成功事例から、段階的統合が採用率を70%向上させた実績に基づく推奨"
    );
    expect(result.relevanceScore).toBe(0.82);
    expect(result.similarPatternId).toBe("pattern_20240115_001");
    expect(result.relevanceScore).toBeGreaterThanOrEqual(0.7);
    expect(result.relevanceScore).toBeLessThanOrEqual(1.0);
    expect(mockAIEngine.generateRecommendation).toHaveBeenCalledWith(newDealInput);
  });
});