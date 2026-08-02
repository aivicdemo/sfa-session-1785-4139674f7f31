import { visualizeDetectionProblemPatterns } from "../../src/logic/it-1-br-2-1-2-1";

describe("営業データ品質検証エンジンの構築", () => {
  // SCEN-1190
  test("同じ種類の検証エラーが複数件含まれている場合、問題パターンが集約されて1つの問題として返される", () => {
    const validation_errors = [
      {
        record_id: 1,
        error_type: "customer_name_blank",
        error_description: "顧客名が空白",
        severity: "high",
        detected_at: "2024-01-15T10:00:00Z",
      },
      {
        record_id: 2,
        error_type: "customer_name_blank",
        error_description: "顧客名が空白",
        severity: "high",
        detected_at: "2024-01-15T10:05:00Z",
      },
      {
        record_id: 3,
        error_type: "customer_name_blank",
        error_description: "顧客名が空白",
        severity: "high",
        detected_at: "2024-01-15T10:10:00Z",
      },
    ];

    const result = visualizeDetectionProblemPatterns(validation_errors);

    expect(result).toEqual({
      problem_patterns: [
        {
          problem_type: "顧客名が空白",
          error_type: "customer_name_blank",
          affected_record_count: 3,
          severity: "high",
          first_detected_at: "2024-01-15T10:00:00Z",
          last_detected_at: "2024-01-15T10:10:00Z",
        },
      ],
      total_pattern_count: 1,
      total_affected_records: 3,
    });
  });
});