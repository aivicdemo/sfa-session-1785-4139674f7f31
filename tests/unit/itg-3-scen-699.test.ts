import { validateCustomerDataCompleteness } from "../../src/logic/it-1-br-3-1-1-1";

describe("顧客データ完全性・妥当性判定機能", () => {
  // SCEN-699
  test("顧客名が空のとき、推奨生成不可と判定される", () => {
    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn(),
    };

    const customerData = {
      customerId: "CUST-001",
      customerName: "",
      industry: "IT",
      companySize: "medium",
      dealCondition: "new_deal",
    };

    const result = validateCustomerDataCompleteness(
      customerData,
      mockAIRecommendationEngine
    );

    expect(result.status).toBe("ERROR_EMPTY_CUSTOMER_NAME");
    expect(result.message).toBe("顧客名は必須項目です");
    expect(mockAIRecommendationEngine.generateRecommendation).not.toHaveBeenCalled();
  });
});