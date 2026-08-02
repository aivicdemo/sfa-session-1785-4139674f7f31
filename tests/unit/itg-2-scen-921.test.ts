import { validateCustomerPurchaseConsiderationData } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データの重複・不整合検出と正規化ルール適用による統合判定機能", () => {
  test("SCEN-921: 顧客購買検討データ入力検証機能 - 同一の入力データで2回連続実行したとき両回とも同じ検証結果を返す", () => {
    const testData = {
      customerId: "C001",
      productId: "P123",
      considerationStage: "提案中",
      amount: 500000,
    };

    const result1 = validateCustomerPurchaseConsiderationData(testData);
    const result2 = validateCustomerPurchaseConsiderationData(testData);

    expect(result1.validationStatus).toBe(result2.validationStatus);
    expect(result1.errorCodes).toEqual(result2.errorCodes);
    expect(result1.warningMessages).toEqual(result2.warningMessages);
  });
});