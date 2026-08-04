import { validatePurchaseHistoryDataQuality } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェントの推奨根拠の可視化機能", () => {
  test("SCEN-1470: 購買履歴データ品質判定機能 - 購買日時が無効な形式のときエラーを返す", () => {
    const invalidPurchaseRecord = {
      customer_id: "CUST001",
      purchase_datetime: "2024-13-45 25:70:90",
      amount: 100000,
      product_id: "PROD001"
    };

    expect(() => {
      validatePurchaseHistoryDataQuality(invalidPurchaseRecord);
    }).toThrow(/purchase_datetime/);

    try {
      validatePurchaseHistoryDataQuality(invalidPurchaseRecord);
    } catch (error: any) {
      expect(error.code).toBe("INVALID_PURCHASE_DATE_FORMAT");
      expect(error.message).toBe(
        "購買日時の形式が無効です。YYYY-MM-DD HH:mm:ss 形式で入力してください"
      );
      expect(error.field).toBe("purchase_datetime");
      expect(error.invalidValue).toBe("2024-13-45 25:70:90");
    }
  });
});