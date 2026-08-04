import { generateRecommendation } from "../../src/logic/it-1-br-3-3-2-1";

describe("成功パターンマッチング機能 - 入力値欠落時のエラーハンドリング", () => {
  test("SCEN-1292: 商談入力から必須フィールドが欠落している場合、VALIDATION_ERROR_MISSING_REQUIRED_FIELDエラーが返される", () => {
    const mockAIEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const incompleteInput = {
      customer_name: undefined,
      deal_amount: 5000000,
      industry: "IT",
      deal_stage: "proposal",
    };

    expect(() => {
      generateRecommendation(incompleteInput, mockAIEngine);
    }).toThrow(/顧客名/);

    expect(mockAIEngine.generateRecommendation).not.toHaveBeenCalled();
  });
});