import { detectDuplicateCustomers } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データ重複・不整合検出と正規化ルール適用による統合判定機能", () => {
  // SCEN-351
  test("住所が完全一致している場合、重複候補スコアが加算される", () => {
    const customerA = {
      customer_id: "CUST001",
      customer_name: "顧客A",
      address: "東京都渋谷区1-1-1",
      email: "customerA@example.com",
      phone: "090-1234-5678",
    };

    const customerB = {
      customer_id: "CUST002",
      customer_name: "顧客B",
      address: "東京都渋谷区1-1-1",
      email: "customerB@example.com",
      phone: "090-8765-4321",
    };

    const result = detectDuplicateCustomers([customerA, customerB]);

    expect(result.duplicate_score).toBeGreaterThanOrEqual(15);
    expect(result.matching_criteria).toContain("address");
    expect(result.is_duplicate_candidate).toBe(true);
  });
});