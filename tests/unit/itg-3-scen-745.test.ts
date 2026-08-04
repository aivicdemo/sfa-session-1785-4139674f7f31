import { describe, test, expect, beforeEach, jest } from "@jest/globals";
import { validateCustomerDataCompleteness } from "../../src/logic/it-1-br-3-1-1-1";

describe("顧客データ完全性・妥当性判定機能", () => {
  let mockAIEngine: any;

  beforeEach(() => {
    mockAIEngine = {
      generateRecommendation: jest.fn(),
    };
    jest.clearAllMocks();
  });

  // SCEN-745
  test("必須項目である企業規模が空文字列のとき、推奨生成不可と判定される", () => {
    const customerData = {
      companyName: "Sample Corporation",
      industry: "Software Development",
      revenue: 50000000,
      companySize: "",
      contactPerson: "John Doe",
      email: "john@example.com",
    };

    const result = validateCustomerDataCompleteness(customerData, mockAIEngine);

    expect(result.isRecommendationGeneratable).toBe(false);
    expect(result.detailMessage).toMatch(/企業規模/);
    expect(result.detailMessage).toMatch(/必須項目/);
    expect(result.detailMessage).toMatch(/入力されていません/);
    expect(mockAIEngine.generateRecommendation).not.toHaveBeenCalled();
  });
});