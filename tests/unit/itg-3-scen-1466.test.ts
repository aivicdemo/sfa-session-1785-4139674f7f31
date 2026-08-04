import { evaluatePurchaseHistoryDataQuality } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェントの推奨根拠の可視化機能", () => {
  test("SCEN-1466: 購買履歴データ品質判定機能 - 顧客IDが空文字のときエラーを返す", () => {
    const inputData = {
      customerId: "",
      purchaseDate: "2024-01-15",
      productId: "PROD-12345",
      quantity: 5,
      amount: 100000,
    };

    const result = () => evaluatePurchaseHistoryDataQuality(inputData);

    expect(result).toThrow(/INVALID_CUSTOMER_ID_EMPTY/);
  });
});