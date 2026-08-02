import { validateCustomerPurchaseData } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データの重複・不整合検出と正規化ルール適用による統合判定機能", () => {
  // SCEN-901
  test("購買履歴の顧客IDが空文字列のとき不整合を検出する", () => {
    const purchase_record = {
      customerId: "",
      purchaseDateTime: "2024-01-15T10:30:00Z",
      productId: "PROD-001",
      amount: 50000,
    };

    const result = validateCustomerPurchaseData(purchase_record);

    expect(result).toEqual({
      isValid: false,
      errors: [
        {
          errorCode: "CUSTOMER_ID_EMPTY",
          errorMessage:
            "顧客IDが空文字列です。有効な顧客IDを入力してください。",
          fieldName: "customerId",
        },
      ],
    });
  });
});