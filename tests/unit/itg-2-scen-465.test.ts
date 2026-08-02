import { detectDuplicateCustomersAndRecordInconsistencies } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データの重複・不整合検出と正規化ルール適用による統合判定機能", () => {
  // SCEN-465
  test("重複検出と不整合ログ記録 - 住所表記形式差異が検出される場合", () => {
    const input_test_id = "SCEN-465";
    const input_customer_1 = {
      customer_id: "001",
      name: "田中太郎",
      address: "東京都渋谷区",
      created_at: new Date("2024-01-15T10:00:00Z"),
    };
    const input_customer_2 = {
      customer_id: "002",
      name: "田中太郎",
      address: "東京都渋谷区1-2-3",
      created_at: new Date("2024-01-15T10:30:00Z"),
    };
    const input_customers = [input_customer_1, input_customer_2];
    const input_inconsistency_logging_enabled = true;

    const result = detectDuplicateCustomersAndRecordInconsistencies({
      test_id: input_test_id,
      customers: input_customers,
      inconsistency_logging_enabled: input_inconsistency_logging_enabled,
    });

    expect(result.duplicate_detected).toBe(true);
    expect(result.duplicate_pairs).toHaveLength(1);
    expect(result.duplicate_pairs[0]).toEqual({
      customer_id_1: "001",
      customer_id_2: "002",
      reason: "name_and_address_similarity",
    });

    expect(result.inconsistency_logs).toHaveLength(1);
    const recorded_log = result.inconsistency_logs[0];
    expect(recorded_log.test_id).toBe("SCEN-465");
    expect(recorded_log.customer_id_1).toBe("001");
    expect(recorded_log.customer_id_2).toBe("002");
    expect(recorded_log.inconsistency_type).toBe("address_format_difference");
    expect(recorded_log.status).toBe("unresolved");
    expect(recorded_log.inconsistency_id).toBeDefined();

    expect(result.duplicate_judgment_result).toBeDefined();
    expect(result.duplicate_judgment_result.inconsistency_id).toBe(
      recorded_log.inconsistency_id
    );
    expect(result.duplicate_judgment_result.merged_customer_id).toBe("001");
  });
});