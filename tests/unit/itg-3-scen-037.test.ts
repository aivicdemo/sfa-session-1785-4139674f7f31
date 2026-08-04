import {
  generateRecommendationContent,
} from "../../src/logic/it-1-br-3-3-2-1";

describe("推奨内容生成機能 - 過去成功パターンが1件の場合", () => {
  test("SCEN-037: 過去成功パターンが1件のみの場合に推奨内容が正常に生成される", () => {
    // Arrange: スタブ化されたAIRecommendationEngine
    const mockAIEngine = {
      findSimilarPatterns: jest.fn().mockReturnValue([
        {
          patternId: "pattern_001",
          industryType: "製造業",
          dealAmount: 5000000,
          successFactor: "導入支援サービスの提案",
          successCount: 1,
        },
      ]),
      evaluatePatternRelevance: jest.fn().mockReturnValue(0.85),
      generateRecommendation: jest.fn().mockReturnValue({
        recommendationApproach: "導入支援サービスの充実化を提案",
        basis:
          "過去1件の成功事例において同じ顧客属性で有効",
        confidenceScore: 0.85,
      }),
      explainRecommendationReasoning: jest.fn(),
    };

    // 新規案件データ
    const newDealInput = {
      customerIndustry: "製造業",
      dealAmount: 4500000,
      customerEmployeeCount: 500,
    };

    // Act
    const result = generateRecommendationContent(
      newDealInput,
      mockAIEngine
    );

    // Assert
    expect(result.recommendationApproach).toBe(
      "導入支援サービスの充実化を提案"
    );
    expect(result.basis).toBe(
      "過去1件の成功事例において同じ顧客属性で有効"
    );
    expect(result.confidenceScore).toBe(0.85);
    expect(result.status).toBe("SUCCESS");
    expect(result.errorMessage).toBeUndefined();
  });
});