import { validateRecommendationDataCompleteness } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェントの推奨根拠の可視化機能", () => {
  test("SCEN-727: 推奨生成前データ完全性判定機能 - マスタに存在しないユーザーIDのとき推奨生成不可と判定される", () => {
    // Arrange
    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const requestWithInvalidUserId = {
      userId: "USER_NOTFOUND_999",
      customerId: "CUST_12345",
      dealId: "DEAL_67890",
      dealStage: "proposal",
      industryCode: "IND_001",
      companySize: "large",
      estimatedValue: 5000000,
    };

    // Act & Assert
    expect(() =>
      validateRecommendationDataCompleteness(
        requestWithInvalidUserId,
        mockAIRecommendationEngine
      )
    ).toThrow(/SALES_STAFF_NOT_FOUND/);

    // Assert: AIRecommendationEngine.generateRecommendation should not be called
    expect(mockAIRecommendationEngine.generateRecommendation).not.toHaveBeenCalled();
  });
});