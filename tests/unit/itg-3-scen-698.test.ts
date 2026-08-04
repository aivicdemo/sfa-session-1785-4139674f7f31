import { validateCustomerDataCompleteness } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェントの推奨根拠の可視化機能", () => {
  // SCEN-698
  test("顧客データ完全性・妥当性判定機能 - 必須項目すべてが入力されているとき、推奨生成可能と判定される", () => {
    // Arrange
    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendedApproach: "提案アプローチA",
        confidenceScore: 85,
      }),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const completeCustomerData = {
      customerName: "株式会社ABC",
      emailAddress: "contact@abc-corp.jp",
      phoneNumber: "03-1234-5678",
      dealStage: "PROPOSAL",
      productCategory: "SaaS",
      budgetSize: "1000万円～5000万円",
    };

    // Act
    const result = validateCustomerDataCompleteness(
      completeCustomerData,
      mockAIRecommendationEngine
    );

    // Assert
    expect(result.isRecommendationGenerationPossible).toBe(true);
    expect(result.validationStatus).toBe("COMPLETE");
    expect(result.statusCode).toBe(200);
    expect(result.errorMessage).toBeUndefined();
    expect(mockAIRecommendationEngine.generateRecommendation).toBeDefined();
  });
});