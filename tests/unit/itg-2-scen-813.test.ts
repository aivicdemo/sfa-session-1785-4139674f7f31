import { detectDuplicateAndInconsistency } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データ重複・不整合検出機能", () => {
  test("SCEN-813: メールアドレスが空文字列の場合、その項目は検出ロジックからスキップされる", () => {
    const customer_record_1 = {
      customer_id: "CUST-001",
      customer_name: "山田太郎",
      email: "",
      phone: "090-1234-5678",
      address: "東京都渋谷区1-2-3",
    };

    const customer_record_2 = {
      customer_id: "CUST-002",
      customer_name: "山田太郎",
      email: "",
      phone: "090-1234-5678",
      address: "東京都渋谷区1-2-3",
    };

    const input_records = [customer_record_1, customer_record_2];

    const detection_result = detectDuplicateAndInconsistency(input_records);

    expect(detection_result).toEqual({
      is_duplicate: true,
      duplicate_pair_ids: ["CUST-001", "CUST-002"],
      matching_fields: ["customer_name", "phone", "address"],
      skipped_fields: ["email"],
      confidence_score: 1.0,
    });
  });
});