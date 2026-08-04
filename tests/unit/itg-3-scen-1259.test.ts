import { generateProposalValidation } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェントの推奨根拠の可視化機能", () => {
  test("SCEN-1259: 顧客ニーズ適合度の入力値が欠落しているときに適切なエラー判定が出力される", () => {
    const input = {
      customerName: "テスト顧客",
      dealCondition: "新規営業案件",
      pastSuccessPatternId: "pattern_001",
      customerNeedsFitScore: null,
    };

    const mockAIEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const result = generateProposalValidation(input, mockAIEngine);

    expect(result.statusCode).toBe(400);
    expect(result.errorCode).toBe("VALIDATION_ERROR_MISSING_FIELD");
    expect(result.errorMessage).toBe(
      "顧客ニーズ適合度は必須項目です。0～100の数値で入力してください。"
    );
    expect(result.failedField).toBe("customerNeedsFitScore");
    expect(mockAIEngine.generateRecommendation).not.toHaveBeenCalled();
  });
});