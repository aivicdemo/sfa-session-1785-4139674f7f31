import { detectQualityIssuePatterns } from "../../src/logic/it-1-br-2-1-2-1";

describe("営業データ品質検証エンジン - 問題パターン検出", () => {
  // SCEN-1188
  test("検出問題パターンの可視化 - 検証エラーが1件の場合、1つの問題パターンが返される", () => {
    const validation_errors = [
      {
        record_id: "cust_001",
        field_name: "customer_name",
        error_type: "empty_value",
        error_message: "顧客名が空文字列です",
        detected_at: "2024-01-15T10:30:00Z",
      },
    ];

    const result = detectQualityIssuePatterns(validation_errors);

    expect(result).toEqual({
      total_patterns: 1,
      patterns: [
        {
          issue_type: "empty_value",
          field_name: "customer_name",
          error_description: "顧客名が空文字列です",
          occurrence_count: 1,
        },
      ],
    });
  });
});