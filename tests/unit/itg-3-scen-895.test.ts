import { findSimilarPatterns } from "../../src/logic/it-1-br-3-3-2-1";

describe("成功パターン照合機能", () => {
  test("SCEN-895: 新規案件条件が過去成功パターン1件と照合される", async () => {
    const newDealCondition = {
      customerIndustry: "製造業",
      budgetScale: 5000000,
      implementationPeriodMonths: 3,
      decisionMakerCount: 2,
    };

    const pastSuccessPattern = {
      patternId: "PSP-001",
      customerIndustry: "製造業",
      budgetScale: 4500000,
      implementationPeriodMonths: 3,
      decisionMakerCount: 2,
      contractRate: 0.85,
    };

    const mockAIRecommendationEngine = {
      findSimilarPatterns: jest
        .fn()
        .mockResolvedValue([
          {
            matchedPatternId: "PSP-001",
            similarityScore: 0.875,
            matchReason:
              "顧客業種が一致、予算規模が±10%以内、導入期間が同一",
            applicabilityEvaluation: "適用可能",
            matchedItemCount: 4,
          },
        ]),
    };

    const result = await findSimilarPatterns(newDealCondition, mockAIRecommendationEngine);

    expect(result).toHaveLength(1);
    expect(result[0].matchedPatternId).toBe("PSP-001");
    expect(result[0].similarityScore).toBeGreaterThanOrEqual(0.85);
    expect(result[0].matchReason).toBe(
      "顧客業種が一致、予算規模が±10%以内、導入期間が同一"
    );
    expect(result[0].applicabilityEvaluation).toBe("適用可能");
    expect(result[0].matchedItemCount).toBe(4);

    expect(mockAIRecommendationEngine.findSimilarPatterns).toHaveBeenCalledWith(
      newDealCondition
    );
  });
});