import { describe, test, expect, beforeEach } from "@jest/globals";
import { generateRecommendationForDealConditions } from "../../src/logic/it-1-br-3-3-2-1";

describe("成功パターン抽出・照合機能 - 商談条件が1個のとき該当する提案アプローチが推奨される", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // SCEN-562
  test("商談条件が1個（業種のみ）のとき、過去成功パターンに基づく提案アプローチが推奨される", () => {
    const mockFindSimilarPatterns = jest.fn().mockReturnValue([
      {
        patternId: "PATTERN-MFG-001",
        industry: "製造業",
        successRatio: 0.85,
        description: "製造業向けDX提案"
      }
    ]);

    const mockGenerateRecommendation = jest.fn().mockReturnValue({
      recommendationId: "APPROACH-MFG-001",
      approachName: "製造現場のデジタル化支援提案",
      description: "製造業の現場デジタル化を支援する提案アプローチ",
      confidenceScore: 85,
      basedOnPatterns: ["PATTERN-MFG-001"]
    });

    const mockAIEngine = {
      findSimilarPatterns: mockFindSimilarPatterns,
      generateRecommendation: mockGenerateRecommendation
    };

    const newDealCondition = {
      industry: "製造業"
    };

    const result = generateRecommendationForDealConditions(
      newDealCondition,
      mockAIEngine
    );

    expect(mockFindSimilarPatterns).toHaveBeenCalledTimes(1);
    expect(mockFindSimilarPatterns).toHaveBeenCalledWith(newDealCondition);

    expect(mockGenerateRecommendation).toHaveBeenCalledTimes(1);
    expect(mockGenerateRecommendation).toHaveBeenCalledWith(
      newDealCondition,
      expect.arrayContaining([
        expect.objectContaining({
          patternId: "PATTERN-MFG-001"
        })
      ])
    );

    expect(result).toBeDefined();
    expect(result.recommendationId).toBe("APPROACH-MFG-001");
    expect(result.approachName).toBe("製造現場のデジタル化支援提案");
    expect(result.confidenceScore).toBe(85);
    expect(result.basedOnPatterns).toContain("PATTERN-MFG-001");
  });
});