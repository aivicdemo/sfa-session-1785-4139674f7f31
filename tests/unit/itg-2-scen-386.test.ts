import { detectDuplicateCustomers } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データの重複・不整合検出と正規化ルール適用による統合判定機能", () => {
  // SCEN-386
  test("電話番号が異なる場合、重複候補に含められない", () => {
    const recordA = {
      customer_id: "CUST001",
      name: "田中太郎",
      phone: "090-1234-5678",
      email: "tanaka@example.com",
    };

    const recordB = {
      customer_id: "CUST002",
      name: "田中太郎",
      phone: "090-9876-5432",
      email: "tanaka@example.com",
    };

    const result = detectDuplicateCustomers([recordA, recordB]);

    expect(result.duplicate_candidates).toEqual([]);
    expect(result.duplicate_score).toBe(0);
  });
});