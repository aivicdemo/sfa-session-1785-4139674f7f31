import { detectDuplicateCustomers } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データの重複・不整合検出と正規化ルール適用による統合判定機能", () => {
  // SCEN-508
  test("顧客住所が欠落しているとき、他の判定基準で重複判定が継続される", () => {
    const customerA = {
      id: "cust_001",
      name: "田中太郎",
      phone: "090-1234-5678",
      address: null,
    };

    const customerB = {
      id: "cust_002",
      name: "田中太郎",
      phone: "090-1234-5678",
      address: "東京都渋谷区",
    };

    const result = detectDuplicateCustomers([customerA, customerB]);

    expect(result.isDuplicate).toBe(true);
    expect(result.duplicatePairs).toHaveLength(1);
    expect(result.duplicatePairs[0]).toEqual({
      customerId1: "cust_001",
      customerId2: "cust_002",
      matchedFields: ["name", "phone"],
      duplicateLevel: "high",
      excludedFields: ["address"],
    });
    expect(result.judgmentLog).toContain(
      "住所フィールドは欠落しているため判定から除外、他の基準で継続"
    );
    expect(result.judgmentLog).toContain("名前・電話番号が一致");
  });
});