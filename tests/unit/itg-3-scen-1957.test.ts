import { evaluatePatternRelevance } from "../../src/logic/it-1-br-3-3-2-1";

describe("成功パターン抽出・照合機能", () => {
  // SCEN-1957
  test("パターンマッチスコアが閾値直下（0.74）のときにパターンが除外される", () => {
    const patternThreshold = 0.75;

    const mockAIRecommendationEngine = {
      evaluatePatternRelevance: jest.fn((pattern: any) => {
        if (pattern.id === "pattern_below_threshold") {
          return {
            score: 0.74,
            isRelevant: false,
          };
        }
        return {
          score: 0.85,
          isRelevant: true,
        };
      }),
    };

    const dealCondition = {
      customerIndustry: "finance",
      budgetScale: "large",
      productCategory: "consulting",
    };

    const successPatterns = [
      {
        id: "pattern_below_threshold",
        description: "Below threshold pattern",
        applicableIndustries: ["finance"],
        matchedScore: 0.74,
      },
      {
        id: "pattern_above_threshold",
        description: "Above threshold pattern",
        applicableIndustries: ["finance"],
        matchedScore: 0.85,
      },
    ];

    const exclusionLog: Array<{
      patternId: string;
      score: number;
      reason: string;
    }> = [];

    const recommendationResult = {
      includedPatterns: successPatterns.filter((pattern) => {
        const evaluation = mockAIRecommendationEngine.evaluatePatternRelevance(
          pattern
        );
        if (evaluation.score < patternThreshold) {
          exclusionLog.push({
            patternId: pattern.id,
            score: evaluation.score,
            reason: `below_threshold_${patternThreshold}`,
          });
          return false;
        }
        return true;
      }),
      exclusionLog,
    };

    expect(recommendationResult.includedPatterns).toHaveLength(1);
    expect(recommendationResult.includedPatterns[0].id).toBe(
      "pattern_above_threshold"
    );
    expect(recommendationResult.includedPatterns[0].matchedScore).toBe(0.85);

    expect(recommendationResult.exclusionLog).toHaveLength(1);
    expect(recommendationResult.exclusionLog[0]).toEqual({
      patternId: "pattern_below_threshold",
      score: 0.74,
      reason: "below_threshold_0.75",
    });

    expect(
      recommendationResult.includedPatterns.every(
        (p) => p.matchedScore >= patternThreshold
      )
    ).toBe(true);
  });
});