import { validateCustomerDataCompleteness } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェントの推奨根拠の可視化機能", () => {
  // SCEN-714
  test("[normal] 顧客データ完全性・妥当性判定機能 - 判定が「推奨生成不可」のとき、推奨生成可能フラグがfalseで通知される", () => {
    const incompleteCustomerData = {
      customerId: "CUST-001",
      companyName: "テスト会社",
      industry: "",
      employeeCount: null,
      annualRevenue: undefined,
      contactEmail: "contact@example.com",
      contactPhone: "",
      address: "東京都渋谷区",
    };

    const result = validateCustomerDataCompleteness(incompleteCustomerData);

    expect(result.recommendationEligible).toBe(false);
    expect(result.notificationPayload).toEqual({
      recommendationEligible: false,
      userMessage:
        "推奨の生成に必要な顧客情報が不足しています。詳細情報をご確認ください",
      missingFields: expect.arrayContaining(["industry", "employeeCount"]),
      validationErrors: expect.any(Array),
    });
    expect(result.notificationPayload.recommendationEligible).toBe(false);
  });
});