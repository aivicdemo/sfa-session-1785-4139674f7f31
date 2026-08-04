import { validateCustomerDataCompleteness } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェントの推奨根拠の可視化機能", () => {
  // SCEN-717: [error] 推奨生成前データ完全性判定機能 - 顧客IDが空のとき推奨生成不可と判定される
  test("顧客IDが空文字列のとき、データ完全性判定がfalseで返され、推奨生成が中断される", () => {
    const inputData = {
      customerId: "",
      dealConditions: {
        industry: "製造業",
        companySize: "大企業",
        budget: 5000000,
        targetProduct: "ERP",
      },
      pastData: {
        previousDealCount: 3,
        successRate: 0.75,
        averageDealSize: 3500000,
      },
    };

    const result = validateCustomerDataCompleteness(inputData);

    expect(result).toEqual({
      isValid: false,
      errorCode: "MISSING_CUSTOMER_ID",
      errorMessage:
        "顧客IDが未入力です。推奨生成には顧客IDが必須です。",
    });
  });
});