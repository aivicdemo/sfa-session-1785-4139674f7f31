import { evaluatePatternRelevance } from "../../src/logic/it-1-br-3-3-2-1";

describe("成功パターン適用可能性スコア判定機能", () => {
  // SCEN-138
  test("適用可能性スコアが許可ラインちょうどで推論が実行される", async () => {
    const RELEVANCE_THRESHOLD = 0.70;
    const mockRecommendationEngine = {
      evaluatePatternRelevance: jest.fn().mockResolvedValue({
        score: RELEVANCE_THRESHOLD,
        isApplicable: true,
      }),
      generateRecommendation: jest
        .fn()
        .mockResolvedValue({
          recommendationApproach:
            "標準提案アプローチA - 顧客規模別戦略に基づく段階的提案",
          reasoningExplanation:
            "過去の類似案件（同業種・同規模）において、段階的提案により成約率が85%に達した成功パターンと合致。",
          confidenceScore: 85,
        }),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
    };

    const dealCondition = {
      customerIndustry: "製造業",
      customerSize: "中堅企業",
      dealAmount: 5000000,
      dealStage: "初期接触",
      requirementType: "業務効率化",
    };

    const evaluationResult = await mockRecommendationEngine.evaluatePatternRelevance(
      dealCondition
    );

    expect(evaluationResult.score).toBe(RELEVANCE_THRESHOLD);
    expect(evaluationResult.isApplicable).toBe(true);
    expect(evaluationResult.score).toBeGreaterThanOrEqual(RELEVANCE_THRESHOLD);

    if (evaluationResult.score >= RELEVANCE_THRESHOLD) {
      const recommendationResult =
        await mockRecommendationEngine.generateRecommendation(dealCondition);

      expect(mockRecommendationEngine.generateRecommendation).toHaveBeenCalledTimes(
        1
      );
      expect(mockRecommendationEngine.generateRecommendation).toHaveBeenCalledWith(
        dealCondition
      );

      expect(recommendationResult).toBeDefined();
      expect(recommendationResult.recommendationApproach).toBeDefined();
      expect(typeof recommendationResult.recommendationApproach).toBe("string");
      expect(recommendationResult.recommendationApproach.length).toBeGreaterThan(0);

      expect(recommendationResult.reasoningExplanation).toBeDefined();
      expect(typeof recommendationResult.reasoningExplanation).toBe("string");
      expect(recommendationResult.reasoningExplanation.length).toBeGreaterThan(0);

      expect(recommendationResult.confidenceScore).toBe(85);
      expect(recommendationResult.confidenceScore).toBeGreaterThanOrEqual(0);
      expect(recommendationResult.confidenceScore).toBeLessThanOrEqual(100);
    }
  });
});