import { judgeCustomerDuplication } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データの重複・不整合検出と正規化ルール適用による統合判定機能", () => {
  // SCEN-1085
  test("顧客名が完全一致し他属性も一致するとき、重複と判定される", () => {
    const customerDataA = {
      customer_name: "山田太郎",
      postal_code: "100-0001",
      address: "東京都千代田区丸の内",
      phone_number: "03-1234-5678",
      email_address: "yamada@example.com"
    };

    const customerDataB = {
      customer_name: "山田太郎",
      postal_code: "100-0001",
      address: "東京都千代田区丸の内",
      phone_number: "03-1234-5678",
      email_address: "yamada@example.com"
    };

    const result = judgeCustomerDuplication(customerDataA, customerDataB);

    expect(result.is_duplicate).toBe(true);
    expect(result.duplication_score).toBe(100);
    expect(result.duplication_reason).toBe("顧客名完全一致かつ全属性一致");
  });
});