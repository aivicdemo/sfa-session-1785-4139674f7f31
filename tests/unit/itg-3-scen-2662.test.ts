import { evaluatePatternRelevance } from "../../src/logic/it-1-br-3-3-2-1";

describe("成功パターン自動判定機能", () => {
  test("SCEN-2662: 商談条件マッチスコアが閾値直下（79.9%）のとき、不適用として判定される", () => {
    // Stub for AIRecommendationEngine.evaluatePatternRelevance
    const stubAIEngine = {
      evaluatePatternRelevance: jest.fn().mockReturnValue({
        matchScore: 79.9,
        relevanceDetails: {
          customerIndustryMatch: 0.85,
          dealSizeMatch: 0.75,
          productAlignmentMatch: 0.78,
        },
      }),
    };

    // Input data: customer and deal conditions
    const inputData = {
      customerId: "cust_12345",
      customerIndustry: "manufacturing",
      customerScale: "mid_market",
      dealCondition: {
        productCategory: "ERP",
        estimatedAmount: 5000000,
        dealStage: "discovery",
        timelineMonths: 6,
      },
      successPatternId: "pattern_001",
      aiEngine: stubAIEngine,
    };

    // Execute evaluation
    const result = evaluatePatternRelevance(inputData);

    // Assertions: verify match score is below threshold (80%) and marked as not applicable
    expect(result.matchScore).toBe(79.9);
    expect(result.isApplicable).toBe(false);
    expect(result.applicabilityStatus).toBe("不適用");
    expect(result.recommendationGenerated).toBe(false);

    // Verify fallback behavior: top success pattern from master is returned
    expect(result.fallbackPattern).toBeDefined();
    expect(result.fallbackPattern.source).toBe("推奨パターンマスタ");
    expect(result.fallbackPattern.isStatisticallyTopRanked).toBe(true);
    expect(result.fallbackPattern.patternId).toBeDefined();

    // Verify stub was called once
    expect(stubAIEngine.evaluatePatternRelevance).toHaveBeenCalledTimes(1);
    expect(stubAIEngine.evaluatePatternRelevance).toHaveBeenCalledWith(
      expect.objectContaining({
        customerId: "cust_12345",
        dealCondition: expect.any(Object),
      })
    );
  });
});