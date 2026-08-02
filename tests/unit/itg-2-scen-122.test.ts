import { detectDuplicateCustomers } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データの重複・不整合検出と正規化ルール適用による統合判定機能", () => {
  // SCEN-122
  test("複数の重複候補がある場合、相互参照関係を正しく検出する", () => {
    const customerRecords = [
      {
        customer_id: 1001,
        customer_name: "山田太郎",
        email: "yamada@example.com",
      },
      {
        customer_id: 1002,
        customer_name: "山田太郎",
        email: "yamada.taro@example.com",
      },
      {
        customer_id: 1003,
        customer_name: "太郎山田",
        email: "yamada@example.com",
      },
    ];

    const result = detectDuplicateCustomers(customerRecords);

    expect(result.duplicate_clusters).toHaveLength(1);
    expect(result.duplicate_clusters[0].cluster_id).toBe(1);
    expect(result.duplicate_clusters[0].member_ids).toEqual([1001, 1002, 1003]);
    expect(result.duplicate_clusters[0].master_candidate_id).toBe(1001);

    expect(result.duplicate_relations).toHaveLength(3);

    const relationA_B = result.duplicate_relations.find(
      (r) =>
        (r.customer_id_1 === 1001 && r.customer_id_2 === 1002) ||
        (r.customer_id_1 === 1002 && r.customer_id_2 === 1001)
    );
    expect(relationA_B).toBeDefined();
    expect(relationA_B?.match_factors).toContain("name_exact_match");
    expect(relationA_B?.match_factors).toContain("email_partial_match");
    expect(relationA_B?.confidence_score).toBeGreaterThanOrEqual(0.7);

    const relationA_C = result.duplicate_relations.find(
      (r) =>
        (r.customer_id_1 === 1001 && r.customer_id_2 === 1003) ||
        (r.customer_id_1 === 1003 && r.customer_id_2 === 1001)
    );
    expect(relationA_C).toBeDefined();
    expect(relationA_C?.match_factors).toContain("email_exact_match");
    expect(relationA_C?.confidence_score).toBeGreaterThanOrEqual(0.8);

    const relationB_C = result.duplicate_relations.find(
      (r) =>
        (r.customer_id_1 === 1002 && r.customer_id_2 === 1003) ||
        (r.customer_id_1 === 1003 && r.customer_id_2 === 1002)
    );
    expect(relationB_C).toBeDefined();
    expect(relationB_C?.match_factors.length).toBeGreaterThan(0);

    expect(result.merge_order).toEqual([1001, 1002, 1003]);
    expect(result.total_duplicate_clusters).toBe(1);
    expect(result.total_relations_detected).toBe(3);
  });
});