import { generateRecommendation } from "../../src/logic/it-1-br-3-3-2-1";

describe("成功パターン抽出・照合・推奨機能", () => {
  // SCEN-1899
  test("推奨内容の生成タイムスタンプが空文字列のとき推奨に失敗する", async () => {
    const mockAIEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendedApproach: "提案アプローチA",
        confidenceScore: 85,
        generatedAt: "",
        reasoning: "過去事例との類似度が高い",
        cacheKey: "pattern_001"
      }),
      findSimilarPatterns: jest.fn().mockResolvedValue([
        {
          patternId: "cached_001",
          approachName: "キャッシュ済み提案アプローチ",
          successRate: 0.78,
          applicableCount: 12
        }
      ]),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn()
    };

    const newProjectData = {
      customerId: "cust_12345",
      customerIndustry: "製造業",
      customerScale: "中企業",
      dealAmount: 5000000,
      dealStage: "提案準備",
      dealConditions: {
        budget: 5000000,
        timeline: "2024-Q2",
        decisionMaker: "経営層"
      }
    };

    const result = await generateRecommendation(newProjectData, mockAIEngine);

    expect(result.isSuccess).toBe(false);
    expect(result.errorType).toBe("timestamp");
    expect(result.fallbackMessage).toBe(
      "推奨の生成に一時的な遅延が発生しています。過去の推奨履歴から類似案件を表示します"
    );
    expect(result.recommendation).toEqual({
      patternId: "cached_001",
      approachName: "キャッシュ済み提案アプローチ",
      successRate: 0.78,
      applicableCount: 12,
      isFromCache: true
    });
    expect(result.recommendation.isFromCache).toBe(true);
  });
});