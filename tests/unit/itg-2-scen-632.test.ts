import { normalizeAndDetectDuplicateCustomers } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データの重複・不整合検出と正規化ルール適用による統合判定機能", () => {
  // SCEN-632
  test("全角スペースと半角スペースが同一に正規化される", () => {
    const customerRecordA = {
      customer_id: "CUST001",
      customer_name: "山田　太郎",
      customer_email: "yamada.taro@example.com",
      created_at: "2024-01-15T10:00:00Z",
    };

    const customerRecordB = {
      customer_id: "CUST002",
      customer_name: "山田 太郎",
      customer_email: "yamada.taro@example.com",
      created_at: "2024-01-15T11:00:00Z",
    };

    const result = normalizeAndDetectDuplicateCustomers([
      customerRecordA,
      customerRecordB,
    ]);

    expect(result.normalized_records).toHaveLength(2);
    expect(result.normalized_records[0].normalized_name).toBe("山田 太郎");
    expect(result.normalized_records[1].normalized_name).toBe("山田 太郎");
    expect(result.normalized_records[0].normalized_name).toEqual(
      result.normalized_records[1].normalized_name
    );

    expect(result.duplicate_groups).toHaveLength(1);
    expect(result.duplicate_groups[0].candidate_ids).toContain("CUST001");
    expect(result.duplicate_groups[0].candidate_ids).toContain("CUST002");
    expect(result.duplicate_groups[0].is_merge_target).toBe(true);
    expect(result.duplicate_groups[0].confidence_score).toBeGreaterThan(0.9);
  });
});