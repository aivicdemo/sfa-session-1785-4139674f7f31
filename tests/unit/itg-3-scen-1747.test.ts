import { visualizeRecommendationReasoning } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェント推奨根拠の可視化機能", () => {
  test("SCEN-1747: ウェイト値が0.01のとき根拠を含める", () => {
    const mockAIEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const recommendationData = {
      recommendationId: "rec-12345",
      customerId: "cust-001",
      dealId: "deal-5678",
      proposedApproach: "提案アプローチA",
      confidenceScore: 0.87,
      reasons: [
        {
          reason: "過去事例との類似度が高い",
          weight: 0.45,
          confidence: 0.92,
        },
        {
          reason: "テスト根拠",
          weight: 0.01,
          confidence: 0.85,
        },
        {
          reason: "顧客の業種特性に合致",
          weight: 0.35,
          confidence: 0.88,
        },
        {
          reason: "営業タイミングが最適",
          weight: 0.19,
          confidence: 0.90,
        },
      ],
    };

    const result = visualizeRecommendationReasoning(
      recommendationData,
      mockAIEngine
    );

    expect(result).toBeDefined();
    expect(result.visualizationItems).toHaveLength(4);

    const testReason = result.visualizationItems.find(
      (item: { reason: string; weight: number; confidence: number }) =>
        item.reason === "テスト根拠"
    );

    expect(testReason).toBeDefined();
    expect(testReason.weight).toBe(0.01);
    expect(testReason.confidence).toBe(0.85);
    expect(testReason.isDisplayed).toBe(true);

    const displayedReasons = result.visualizationItems.filter(
      (item: { isDisplayed: boolean }) => item.isDisplayed === true
    );
    expect(displayedReasons).toHaveLength(4);

    const weightSum = result.visualizationItems.reduce(
      (sum: number, item: { weight: number }) => sum + item.weight,
      0
    );
    expect(Math.abs(weightSum - 1.0) < 0.001).toBe(true);

    const sortedByWeight = [...result.visualizationItems].sort(
      (a: { weight: number }, b: { weight: number }) => b.weight - a.weight
    );
    expect(sortedByWeight[0].weight).toBe(0.45);
    expect(sortedByWeight[sortedByWeight.length - 1].weight).toBe(0.01);
  });
});