import { findSimilarPatterns } from "../../src/logic/it-1-br-3-3-2-1";

describe("成功パターン照合機能 - 顧客条件が1個入力されたとき照合が正しく実行される", () => {
  // SCEN-898
  test("should match single customer condition and return ranked similar patterns with applicability scores", () => {
    const testNewDeal = {
      customerId: "CUST-001",
      customerConditions: [
        {
          type: "industry",
          value: "manufacturing",
        },
      ],
      dealAmount: 5000000,
      dealStage: "initial_contact",
    };

    const mockSuccessPatterns = [
      {
        patternId: "PAT-101",
        industry: "manufacturing",
        dealSize: "large",
        successRate: 0.92,
        matchingMetrics: {
          industryMatch: true,
          dealSizeProximity: 0.95,
        },
      },
      {
        patternId: "PAT-102",
        industry: "manufacturing",
        dealSize: "medium",
        successRate: 0.88,
        matchingMetrics: {
          industryMatch: true,
          dealSizeProximity: 0.75,
        },
      },
      {
        patternId: "PAT-103",
        industry: "manufacturing",
        dealSize: "small",
        successRate: 0.85,
        matchingMetrics: {
          industryMatch: true,
          dealSizeProximity: 0.65,
        },
      },
    ];

    const mockAiEngine = {
      findSimilarPatterns: jest.fn().mockReturnValue(mockSuccessPatterns),
      generateRecommendation: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const result = findSimilarPatterns(testNewDeal, mockAiEngine);

    expect(result).toBeDefined();
    expect(result.metadata).toBeDefined();
    expect(result.metadata.matchedConditionCount).toBe(1);
    expect(result.metadata.customerConditions).toEqual([
      {
        type: "industry",
        value: "manufacturing",
      },
    ]);

    expect(result.matchedPatterns).toHaveLength(3);

    expect(result.matchedPatterns[0]).toEqual({
      patternId: "PAT-101",
      industry: "manufacturing",
      dealSize: "large",
      successRate: 0.92,
      matchingMetrics: {
        industryMatch: true,
        dealSizeProximity: 0.95,
      },
      applicabilityScore: 1.0,
    });

    expect(result.matchedPatterns[1]).toEqual({
      patternId: "PAT-102",
      industry: "manufacturing",
      dealSize: "medium",
      successRate: 0.88,
      matchingMetrics: {
        industryMatch: true,
        dealSizeProximity: 0.75,
      },
      applicabilityScore: 0.85,
    });

    expect(result.matchedPatterns[2]).toEqual({
      patternId: "PAT-103",
      industry: "manufacturing",
      dealSize: "small",
      successRate: 0.85,
      matchingMetrics: {
        industryMatch: true,
        dealSizeProximity: 0.65,
      },
      applicabilityScore: 0.7,
    });

    expect(result.matchedPatterns.every((p) => p.applicabilityScore >= 0.6 && p.applicabilityScore <= 1.0)).toBe(true);

    expect(mockAiEngine.findSimilarPatterns).toHaveBeenCalledWith(testNewDeal);
    expect(mockAiEngine.findSimilarPatterns).toHaveBeenCalledTimes(1);
  });
});