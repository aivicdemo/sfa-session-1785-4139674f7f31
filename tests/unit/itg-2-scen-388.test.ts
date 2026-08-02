import { detectDuplicateCustomers } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データの重複・不整合検出と正規化ルール適用による統合判定機能", () => {
  // SCEN-388
  test("電話番号が空で顧客名が一致する場合、重複候補に含められない", () => {
    const customerA = {
      customer_id: "CUST001",
      customer_name: "山田太郎",
      phone_number: "",
      registered_at: new Date("2024-01-01T10:00:00Z"),
    };

    const customerB = {
      customer_id: "CUST002",
      customer_name: "山田太郎",
      phone_number: "09012345678",
      registered_at: new Date("2024-01-02T10:00:00Z"),
    };

    const customers = [customerA, customerB];

    const duplicateCandidatesForB = detectDuplicateCustomers(customers);

    const duplicateIdsForB = duplicateCandidatesForB
      .filter((dup) => dup.customer_id_1 === "CUST002" || dup.customer_id_2 === "CUST002")
      .map((dup) =>
        dup.customer_id_1 === "CUST002" ? dup.customer_id_2 : dup.customer_id_1
      );

    expect(duplicateIdsForB).not.toContain("CUST001");
  });
});