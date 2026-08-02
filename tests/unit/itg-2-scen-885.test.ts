import { mergeCustomersWithDuplicateExclusion } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データの重複・不整合検出と正規化ルール適用による統合判定機能", () => {
  // SCEN-885
  test("統合判定対象データに重複レコードが含まれるとき、重複を除外して判定が実行される", () => {
    const duplicate_record_id_1 = "CUST-001";
    const duplicate_record_name = "株式会社テスト";
    const duplicate_record_email = "contact@test.example.com";

    const input_records = [
      {
        customer_id: duplicate_record_id_1,
        customer_name: duplicate_record_name,
        email: duplicate_record_email,
        phone: "03-1234-5678",
        address: "東京都渋谷区",
      },
      {
        customer_id: duplicate_record_id_1,
        customer_name: duplicate_record_name,
        email: duplicate_record_email,
        phone: "03-1234-5678",
        address: "東京都渋谷区",
      },
      {
        customer_id: "CUST-002",
        customer_name: "株式会社別会社",
        email: "info@another.example.com",
        phone: "03-9876-5432",
        address: "東京都新宿区",
      },
    ];

    const result = mergeCustomersWithDuplicateExclusion(input_records);

    const expected_target_record_count = 2;
    const expected_status = "completed";
    const expected_excluded_count = 1;

    expect(result.target_records_count).toBe(expected_target_record_count);
    expect(result.status).toBe(expected_status);
    expect(result.excluded_duplicate_count).toBe(expected_excluded_count);
    expect(result.processing_log).toContain(duplicate_record_id_1);
    expect(Array.isArray(result.merged_customers)).toBe(true);
    expect(result.merged_customers.length).toBe(expected_target_record_count);
  });
});