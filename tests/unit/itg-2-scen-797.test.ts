import { detectAndMergeMultipleDuplicateCustomers } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データの重複・不整合検出と正規化ルール適用による統合判定機能", () => {
  // SCEN-797
  test("重複候補顧客が複数件の場合、全件の統合判定が実施される", () => {
    const duplicate_candidate_1 = {
      customer_id: "cust_001_A",
      customer_name: "株式会社ABC",
      postal_code: "100-0001",
      address: "東京都千代田区丸の内1-1-1",
      phone_number: "03-1234-5678",
      email: "contact@abc.co.jp",
      created_at: new Date("2024-01-10T09:00:00Z"),
    };

    const duplicate_candidate_2 = {
      customer_id: "cust_001_B",
      customer_name: "ABC株式会社",
      postal_code: "100-0001",
      address: "東京都千代田区丸の内1-1-1",
      phone_number: "03-1234-5678",
      email: "contact@abc.co.jp",
      created_at: new Date("2024-01-11T10:30:00Z"),
    };

    const duplicate_candidate_3 = {
      customer_id: "cust_001_C",
      customer_name: "㈱ABC",
      postal_code: "100-0001",
      address: "東京都千代田区丸の内1丁目1番地1号",
      phone_number: "03-1234-5678",
      email: "contact@abc.co.jp",
      created_at: new Date("2024-01-12T14:15:00Z"),
    };

    const duplicate_candidates = [
      duplicate_candidate_1,
      duplicate_candidate_2,
      duplicate_candidate_3,
    ];

    const result = detectAndMergeMultipleDuplicateCustomers(
      duplicate_candidates
    );

    expect(result.merge_decision).toBe("複数件統合");
    expect(result.comparison_records.length).toBe(3);

    const comparison_1 = result.comparison_records.find(
      (rec) =>
        (rec.customer_id_1 === "cust_001_A" &&
          rec.customer_id_2 === "cust_001_B") ||
        (rec.customer_id_1 === "cust_001_B" && rec.customer_id_2 === "cust_001_A")
    );
    expect(comparison_1).toBeDefined();
    expect(comparison_1?.match_score).toBeGreaterThanOrEqual(0.8);
    expect(comparison_1?.comparison_id).toBeTruthy();
    expect(comparison_1?.comparison_date).toBeTruthy();

    const comparison_2 = result.comparison_records.find(
      (rec) =>
        (rec.customer_id_1 === "cust_001_A" &&
          rec.customer_id_2 === "cust_001_C") ||
        (rec.customer_id_1 === "cust_001_C" && rec.customer_id_2 === "cust_001_A")
    );
    expect(comparison_2).toBeDefined();
    expect(comparison_2?.match_score).toBeGreaterThanOrEqual(0.8);
    expect(comparison_2?.comparison_id).toBeTruthy();
    expect(comparison_2?.comparison_date).toBeTruthy();

    const comparison_3 = result.comparison_records.find(
      (rec) =>
        (rec.customer_id_1 === "cust_001_B" &&
          rec.customer_id_2 === "cust_001_C") ||
        (rec.customer_id_1 === "cust_001_C" && rec.customer_id_2 === "cust_001_B")
    );
    expect(comparison_3).toBeDefined();
    expect(comparison_3?.match_score).toBeGreaterThanOrEqual(0.8);
    expect(comparison_3?.comparison_id).toBeTruthy();
    expect(comparison_3?.comparison_date).toBeTruthy();

    expect(result.final_merged_customer_ids).toContain("cust_001_A");
    expect(result.final_merged_customer_ids).toContain("cust_001_B");
    expect(result.final_merged_customer_ids).toContain("cust_001_C");
    expect(result.final_merged_customer_ids.length).toBe(3);
  });
});