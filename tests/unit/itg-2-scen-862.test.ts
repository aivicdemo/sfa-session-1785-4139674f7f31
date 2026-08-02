import { detectDuplicateCustomers } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データの重複・不整合検出と正規化ルール適用による統合判定機能", () => {
  // SCEN-862
  test("重複判定の類似度スコアが閾値を1ポイント超えるとき、重複と判定される", () => {
    const threshold = 80;
    const existingCustomer = {
      id: "cust_001",
      name: "山田太郎",
      address: "東京都渋谷区",
      phone: "090-1234-5678",
    };
    const newCustomer = {
      id: "cust_002",
      name: "山田太郎",
      address: "東京都渋谷区",
      phone: "090-1234-5679",
    };
    const similarityScore = 81;

    const result = detectDuplicateCustomers(
      [existingCustomer],
      newCustomer,
      threshold,
      similarityScore
    );

    expect(result.isDuplicate).toBe(true);
    expect(result.pairs).toHaveLength(1);
    expect(result.pairs[0]).toEqual({
      existingCustomerId: "cust_001",
      newCustomerId: "cust_002",
      score: 81,
    });
  });
});