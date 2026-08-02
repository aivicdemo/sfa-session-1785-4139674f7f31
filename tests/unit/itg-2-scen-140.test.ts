import { detectDuplicateAndJudgeIntegration } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データの重複・不整合検出と正規化ルール適用による統合判定機能", () => {
  // SCEN-140
  test("住所が欠落しているレコードは検査対象外に除外される", () => {
    const test_record_with_missing_address = {
      customer_id: "CUST-001",
      customer_name: "山田太郎",
      phone_number: "090-1234-5678",
      address: null,
    };

    const reference_record_with_complete_address = {
      customer_id: "CUST-001",
      customer_name: "山田太郎",
      phone_number: "090-1234-5678",
      address: "東京都渋谷区1-1-1",
    };

    const input_dataset = [
      test_record_with_missing_address,
      reference_record_with_complete_address,
    ];

    const result = detectDuplicateAndJudgeIntegration(input_dataset);

    expect(result.excluded_records).toEqual([
      {
        customer_id: "CUST-001",
        customer_name: "山田太郎",
        phone_number: "090-1234-5678",
        address: null,
        exclusion_reason: "住所欠落",
      },
    ]);

    expect(result.processed_records).toEqual([
      {
        customer_id: "CUST-001",
        customer_name: "山田太郎",
        phone_number: "090-1234-5678",
        address: "東京都渋谷区1-1-1",
      },
    ]);

    expect(result.total_excluded_count).toBe(1);
    expect(result.total_processed_count).toBe(1);
  });
});