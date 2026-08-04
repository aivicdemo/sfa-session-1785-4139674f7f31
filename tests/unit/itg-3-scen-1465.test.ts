import { validatePurchaseHistoryData } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェントの推奨根拠の可視化機能", () => {
  // SCEN-1465
  test("購買履歴データ品質判定機能 - 顧客IDが欠けているときエラーを返す", () => {
    const invalidRecord = {
      customerId: null,
      purchaseDate: "2024-01-15",
      amount: 50000,
    };

    const result = validatePurchaseHistoryData(invalidRecord);

    expect(result).toEqual({
      error: {
        code: "MISSING_CUSTOMER_ID",
        message: "顧客IDは必須項目です",
        statusCode: 400,
      },
    });
    expect(result.recommendation).toBeUndefined();
  });
});