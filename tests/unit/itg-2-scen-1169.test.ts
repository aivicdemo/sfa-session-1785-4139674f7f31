import { detectDuplicateCustomers } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データの重複・不整合検出と正規化ルール適用による統合判定機能", () => {
  // SCEN-1169
  test("類似度が閾値直上101%を超える場合、重複候補として判定されない", () => {
    const customerA = {
      customer_id: "CUST001",
      customer_name: "テスト企業A",
      address: "東京都渋谷区",
      phone: "03-1234-5678",
    };

    const customerB = {
      customer_id: "CUST002",
      customer_name: "テスト企業A",
      address: "東京都渋谷区",
      phone: "03-1234-5678",
    };

    const result = detectDuplicateCustomers([customerA, customerB], {
      similarity_threshold: 100,
      similarity_score_stub: 101,
    });

    expect(result.isDuplicate).toBe(false);
    expect(result.duplicate_candidates).toEqual([]);
  });
});