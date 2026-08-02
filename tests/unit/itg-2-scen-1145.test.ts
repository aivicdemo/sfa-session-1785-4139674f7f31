import { validateCustomerDataCompleteness } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データの重複・不整合検出と正規化ルール適用による統合判定機能", () => {
  // SCEN-1145
  test("顧客データの必須フィールドが欠けている場合、検証に不合格となる", () => {
    const incompleteCustomerData = {
      customer_id: "",
      customer_name: "テスト顧客",
      email_address: "test@example.com",
    };

    const validationResult = validateCustomerDataCompleteness(
      incompleteCustomerData
    );

    expect(validationResult.isValid).toBe(false);
    expect(validationResult.status).toBe("FAILED");
    expect(validationResult.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          field: "customer_id",
          message: "必須フィールドが不足しています",
        }),
      ])
    );
    expect(validationResult.qualityScore).toBe(0);
  });
});