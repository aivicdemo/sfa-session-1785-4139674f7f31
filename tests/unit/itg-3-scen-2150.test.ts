import { evaluatePatternRelevance } from "../../src/logic/it-1-br-3-3-2-1";

describe("成功パターン適用可能性の評価", () => {
  // SCEN-2150
  test("成功パターンが空オブジェクトのとき、エラーが発生する", () => {
    const dealCondition = {
      customerId: "CUST-001",
      productCategory: "クラウドソリューション",
      budgetRange: "5000000-10000000",
    };

    const emptySuccessPattern = {};

    const mockAIEngine = {
      evaluatePatternRelevance: jest.fn(),
    };

    mockAIEngine.evaluatePatternRelevance.mockReturnValue({
      isValid: false,
      errorType: "ValidationError",
      httpStatusCode: 400,
      errorMessage: "成功パターンが空オブジェクトであるため、適用可能性スコア算出に必要な成功事例の属性情報が不足している",
    });

    const result = evaluatePatternRelevance(dealCondition, emptySuccessPattern, mockAIEngine);

    expect(result.isValid).toBe(false);
    expect(result.errorType).toBe("ValidationError");
    expect(result.httpStatusCode).toBe(400);
    expect(result.errorMessage).toMatch(/成功パターンが空オブジェクト/);
    expect(result.errorMessage).toMatch(/属性情報/);
  });
});