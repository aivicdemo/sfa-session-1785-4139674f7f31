import { normalizeCustomerName } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データの重複・不整合検出と正規化ルール適用", () => {
  // SCEN-628
  test("正規化ルール適用により顧客名が標準形式に統一される", () => {
    const input_customer_name = "株式会社　テスト　商事";
    const normalized_customer_name = normalizeCustomerName(
      input_customer_name
    );
    const expected_customer_name = "株式会社 テスト商事";

    expect(normalized_customer_name).toBe(expected_customer_name);
  });
});