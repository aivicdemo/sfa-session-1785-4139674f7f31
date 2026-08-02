import { detectDuplicateCustomers } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データの重複・不整合検出と正規化ルール適用による統合判定機能", () => {
  // SCEN-116
  test("重複確度判定の閾値が未指定の場合、デフォルト閾値で判定される", () => {
    const customerA = {
      id: "cust_001",
      name: "山田太郎",
      address: "東京都渋谷区",
      phone: "090-1234-5678",
    };

    const customerB = {
      id: "cust_002",
      name: "山田太郎",
      address: "東京都渋谷区",
      phone: "090-1234-5679",
    };

    const result = detectDuplicateCustomers([customerA, customerB]);

    expect(result).toEqual({
      isDuplicate: true,
      score: 0.92,
      confidence: "high",
      matchedFields: ["name", "address"],
      threshold: 0.85,
    });
  });
});