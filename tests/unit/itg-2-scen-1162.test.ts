import { detectDuplicateCustomers } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データの重複・不整合検出と正規化ルール適用による統合判定機能", () => {
  // SCEN-1162
  test("同一顧客コード・異なる顧客名の2件データに対して重複判定を実行した場合、重複候補として検出される", () => {
    const input_record_1 = {
      customer_code: "C00001",
      customer_name: "株式会社ABC",
      customer_id: "cust_001",
      address: "Tokyo",
      created_at: "2024-01-15T10:00:00Z",
    };

    const input_record_2 = {
      customer_code: "C00001",
      customer_name: "ABC株式会社",
      customer_id: "cust_002",
      address: "Tokyo",
      created_at: "2024-01-15T10:05:00Z",
    };

    const input_records = [input_record_1, input_record_2];

    const result = detectDuplicateCustomers(input_records);

    expect(result).toEqual({
      duplicate_candidates: [
        {
          customer_code: "C00001",
          customer_name: "株式会社ABC",
          customer_id: "cust_001",
          duplicate_flag: true,
          mismatch_reason: "同一顧客コード・異なる顧客名",
        },
        {
          customer_code: "C00001",
          customer_name: "ABC株式会社",
          customer_id: "cust_002",
          duplicate_flag: true,
          mismatch_reason: "同一顧客コード・異なる顧客名",
        },
      ],
      total_duplicate_count: 2,
    });

    expect(result.duplicate_candidates.length).toBe(2);
    expect(result.duplicate_candidates[0].duplicate_flag).toBe(true);
    expect(result.duplicate_candidates[1].duplicate_flag).toBe(true);
    expect(result.duplicate_candidates[0].mismatch_reason).toBe(
      "同一顧客コード・異なる顧客名"
    );
    expect(result.duplicate_candidates[1].mismatch_reason).toBe(
      "同一顧客コード・異なる顧客名"
    );
    expect(result.total_duplicate_count).toBe(2);
  });
});