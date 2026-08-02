import { detectDuplicateCustomers } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データの重複・不整合検出と正規化ルール適用による統合判定機能", () => {
  // SCEN-817
  test("複数の重複候補が存在し、第1順位・第2順位が正しく優先度付けされる", () => {
    const customer_a = {
      id: "cust_001",
      name: "山田太郎",
      phone: "090-1234-5678",
      email: "yamada@example.com",
    };

    const customer_b = {
      id: "cust_002",
      name: "山田太郎",
      phone: "090-1234-5678",
      email: "yamada.taro@example.com",
    };

    const customer_c = {
      id: "cust_003",
      name: "山田太郎",
      phone: "080-9876-5432",
      email: "yamada@example.com",
    };

    const input_customers = [customer_a, customer_b, customer_c];

    const result = detectDuplicateCustomers(input_customers);

    expect(result.duplicate_candidates).toHaveLength(3);

    const candidates_sorted = result.duplicate_candidates.sort(
      (a, b) => b.priority_score - a.priority_score
    );

    expect(candidates_sorted[0]).toEqual({
      customer_id_1: "cust_001",
      customer_id_2: "cust_002",
      match_degree: 98,
      priority_score: 98,
      match_reason: expect.any(String),
    });

    expect(candidates_sorted[1]).toEqual({
      customer_id_1: "cust_001",
      customer_id_2: "cust_003",
      match_degree: 70,
      priority_score: 70,
      match_reason: expect.any(String),
    });

    expect(candidates_sorted[2]).toEqual({
      customer_id_1: "cust_002",
      customer_id_2: "cust_003",
      match_degree: 67,
      priority_score: 67,
      match_reason: expect.any(String),
    });
  });
});