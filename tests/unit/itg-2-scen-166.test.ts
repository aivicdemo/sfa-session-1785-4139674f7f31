import { mergeCustomerRecords } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データの重複・不整合検出と正規化ルール適用による統合判定機能", () => {
  // SCEN-166
  test("マージ対象レコードが1件のとき、マスタレコードへの属性統合が実行される", () => {
    const master_record = {
      customer_id: "CUST-001",
      name: "山田太郎",
      phone: "090-1234-5678",
      address: "東京都渋谷区",
      is_deleted: false,
    };

    const merge_target_record = {
      customer_id: "CUST-002",
      name: "山田太郎",
      phone: "090-9999-9999",
      address: "",
      is_deleted: false,
    };

    const result = mergeCustomerRecords({
      master_record: master_record,
      merge_target_records: [merge_target_record],
      executed_at: new Date("2024-01-15T11:00:00Z"),
      executed_by: "USER-001",
    });

    expect(result.merged_master_record.customer_id).toBe("CUST-001");
    expect(result.merged_master_record.name).toBe("山田太郎");
    expect(result.merged_master_record.phone).toBe("090-1234-5678");
    expect(result.merged_master_record.address).toBe("東京都渋谷区");
    expect(result.merged_master_record.is_deleted).toBe(false);

    expect(result.merged_target_records).toHaveLength(1);
    expect(result.merged_target_records[0].customer_id).toBe("CUST-002");
    expect(result.merged_target_records[0].is_deleted).toBe(true);

    expect(result.merge_status).toBe("completed");

    expect(result.audit_log).toHaveLength(1);
    expect(result.audit_log[0].master_customer_id).toBe("CUST-001");
    expect(result.audit_log[0].merge_target_customer_id).toBe("CUST-002");
    expect(result.audit_log[0].executed_at).toEqual(
      new Date("2024-01-15T11:00:00Z")
    );
    expect(result.audit_log[0].executed_by).toBe("USER-001");
    expect(result.audit_log[0].merge_flag).toBe(true);
  });
});