import { retrieveApplicablePatterns } from "../../src/logic/it-1-br-3-3-2-1";

describe("成功パターン抽出・照合機能", () => {
  // SCEN-1127
  test("過去成功商談が1件のとき、該当パターンの適用可否を正しく判定する", () => {
    const mockFindSimilarPatterns = jest.fn().mockResolvedValue([
      {
        patternId: "past_deal_001",
        industry: "製造業",
        dealAmount: 5000000,
        productName: "ERP導入支援",
        successRate: 1.0,
        similarityScore: 0.92,
      },
    ]);

    const mockEvaluatePatternRelevance = jest.fn().mockResolvedValue({
      patternId: "past_deal_001",
      relevanceScore: 0.85,
      isApplicable: true,
    });

    const mockAIRecommendationEngine = {
      findSimilarPatterns: mockFindSimilarPatterns,
      evaluatePatternRelevance: mockEvaluatePatternRelevance,
    };

    const newDealCondition = {
      industry: "製造業",
      dealAmount: 4800000,
      productName: "ERP導入支援",
    };

    const appliedThreshold = 0.8;

    const result = retrieveApplicablePatterns(
      newDealCondition,
      mockAIRecommendationEngine,
      appliedThreshold
    );

    expect(result).toEqual({
      applicablePatterns: [
        {
          patternId: "past_deal_001",
          similarityScore: 0.92,
          relevanceScore: 0.85,
          isApplicable: true,
          recommendationMessage:
            "過去の類似商談（製造業、ERP導入支援）で成功実績があります",
        },
      ],
      matchingLog: "Pattern matching completed: 1 pattern found, 1 applicable",
    });

    expect(mockFindSimilarPatterns).toHaveBeenCalledWith(newDealCondition);
    expect(mockEvaluatePatternRelevance).toHaveBeenCalledWith({
      patternId: "past_deal_001",
      industry: "製造業",
      dealAmount: 5000000,
      productName: "ERP導入支援",
      successRate: 1.0,
      similarityScore: 0.92,
    });
  });
});