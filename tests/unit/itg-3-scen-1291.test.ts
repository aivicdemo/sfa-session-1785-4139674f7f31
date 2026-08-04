import { generateRecommendation } from "../../src/logic/it-1-br-3-3-2-1";

describe("成功パターンマッチング機能 - 入力値検証", () => {
  test("SCEN-1291: 対象顧客の必須項目が欠落している場合、400エラーとVALIDATION_ERRORが返される", () => {
    const mockAIEngine = {
      generateRecommendation: jest.fn(),
    };

    const incompleteCustomer = {
      customerId: undefined,
      industry: "IT",
      companySize: "large",
      budget: 1000000,
    };

    const result = generateRecommendation(incompleteCustomer, mockAIEngine);

    expect(result.statusCode).toBe(400);
    expect(result.errorCode).toBe("VALIDATION_ERROR");
    expect(result.errorMessage).toMatch(/Missing required field: customerId/);
    expect(result.errorDetails).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          field: "customerId",
        }),
      ])
    );
    expect(mockAIEngine.generateRecommendation).not.toHaveBeenCalled();
  });
});