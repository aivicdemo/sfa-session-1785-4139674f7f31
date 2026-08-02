import { detectDuplicatePatterns } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データの重複・不整合検出と正規化ルール適用による統合判定機能", () => {
  // SCEN-1196
  test("検出問題パターンの可視化 - 重複エラーの件数が6件の場合、件数が正確に集計される", () => {
    const mockDuplicateErrorRecords = [
      {
        record_id: "dup_001",
        error_type: "duplicate",
        customer_id: "cust_100",
        detected_at: "2024-01-15T10:30:00Z",
      },
      {
        record_id: "dup_002",
        error_type: "duplicate",
        customer_id: "cust_101",
        detected_at: "2024-01-15T10:31:00Z",
      },
      {
        record_id: "dup_003",
        error_type: "duplicate",
        customer_id: "cust_102",
        detected_at: "2024-01-15T10:32:00Z",
      },
      {
        record_id: "dup_004",
        error_type: "duplicate",
        customer_id: "cust_103",
        detected_at: "2024-01-15T10:33:00Z",
      },
      {
        record_id: "dup_005",
        error_type: "duplicate",
        customer_id: "cust_104",
        detected_at: "2024-01-15T10:34:00Z",
      },
      {
        record_id: "dup_006",
        error_type: "duplicate",
        customer_id: "cust_105",
        detected_at: "2024-01-15T10:35:00Z",
      },
    ];

    const result = detectDuplicatePatterns(mockDuplicateErrorRecords);

    expect(result.duplicate_error_count).toBe(6);
  });
});