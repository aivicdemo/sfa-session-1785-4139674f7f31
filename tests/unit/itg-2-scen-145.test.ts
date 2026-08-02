import { normalizeCustomerNameSpaces } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データの重複・不整合検出と正規化ルール適用による統合判定機能", () => {
  // SCEN-145
  test("顧客名の半角スペース正規化により、全角スペースが半角に統一される", () => {
    const input_customer_name = "山田　太郎";
    const result = normalizeCustomerNameSpaces(input_customer_name);
    const expected_customer_name = "山田 太郎";

    expect(result).toBe(expected_customer_name);
  });
});