import { determineCustomerDuplication } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データの重複・不整合検出と正規化ルール適用による統合判定機能", () => {
  // SCEN-507
  test("顧客メールアドレスが欠落しているとき、他の判定基準で重複判定が継続される", () => {
    const customerA = {
      customer_id: "CUST-001",
      customer_name: "株式会社サンプル",
      email: null,
      phone_number: "03-1234-5678",
      address: "東京都渋谷区道玄坂1-2-3",
      postal_code: "150-0043",
    };

    const customerB = {
      customer_id: "CUST-002",
      customer_name: "株式会社サンプル",
      email: "",
      phone_number: "03-1234-5678",
      address: "東京都渋谷区道玄坂1-2-3",
      postal_code: "150-0043",
    };

    const result = determineCustomerDuplication(customerA, customerB);

    expect(result.is_duplicate).toBe(true);
    expect(result.matching_criteria).toEqual([
      "customer_name",
      "phone_number",
      "address",
      "postal_code",
    ]);
    expect(result.non_matching_criteria).toEqual(["email"]);
    expect(result.criteria_count).toBe(4);
    expect(result.total_evaluable_criteria).toBe(5);
  });
});