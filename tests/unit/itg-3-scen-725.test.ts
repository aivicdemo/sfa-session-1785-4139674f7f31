import { validateCustomerDataIntegrity } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェント推奨根拠の可視化機能 - データ完全性判定", () => {
  // SCEN-725: [error] 推奨生成前データ完全性判定機能 - 企業規模が負の数のとき推奨生成不可と判定される
  test("企業規模が負の数のとき、データ完全性判定でValidationErrorを返却し、企業規模の検証エラーメッセージを含む", () => {
    const mockAIEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const invalidInputData = {
      customerId: "CUST-001",
      customerName: "サンプル株式会社",
      industry: "製造業",
      companyScale: -100,
      dealAmount: 5000000,
      dealStage: "initial_contact",
    };

    const result = validateCustomerDataIntegrity(
      invalidInputData,
      mockAIEngine
    );

    expect(result.status).toBe("ValidationError");
    expect(result.message).toMatch(/企業規模は0以上の正の数である必要があります/);
    expect(result.recommendation).toBeUndefined();
    expect(mockAIEngine.generateRecommendation).not.toHaveBeenCalled();
  });
});