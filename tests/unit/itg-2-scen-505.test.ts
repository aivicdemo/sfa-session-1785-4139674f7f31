import { detectDuplicateCustomers } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データの重複・不整合検出と正規化ルール適用による統合判定機能", () => {
  // SCEN-505
  test("顧客名が欠落しているとき、他の判定基準で重複判定が継続される", () => {
    const newCustomer = {
      id: "C001",
      name: "",
      email: "customer@example.com",
      phone: "090-1234-5678",
    };

    const existingCustomer = {
      id: "C002",
      name: "山田太郎",
      email: "customer@example.com",
      phone: "090-1234-5678",
    };

    const result = detectDuplicateCustomers(newCustomer, [existingCustomer]);

    expect(result.isDuplicate).toBe(true);
    expect(result.mergeTargetIds).toContain("C002");
    expect(result.matchedCriteria).toContain("email");
    expect(result.matchedCriteria).toContain("phone");
    expect(result.matchedCriteria).not.toContain("name");
  });
});