import { detectCustomerDuplicate } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データの重複・不整合検出と統合判定機能", () => {
  // SCEN-453
  test("顧客名と住所が一致するが電話番号は異なる場合、重複と判定される", () => {
    const customerA = {
      customer_id: "CUST001",
      customer_name: "山田太郎",
      address: "東京都渋谷区1-1-1",
      phone_number: "090-1111-1111",
    };

    const customerB = {
      customer_id: "CUST002",
      customer_name: "山田太郎",
      address: "東京都渋谷区1-1-1",
      phone_number: "090-2222-2222",
    };

    const result = detectCustomerDuplicate(customerA, customerB);

    expect(result.is_duplicate).toBe(true);
    expect(result.matching_basis).toBe("顧客名と住所が一致");
  });
});