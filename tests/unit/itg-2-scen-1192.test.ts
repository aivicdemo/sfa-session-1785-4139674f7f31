import { detectAndVisualizeDataQualityIssues } from '../../src/logic/it-1-br-2-1-2-1';

describe('営業データ品質検証エンジンの構築', () => {
  // SCEN-1192
  test('検出問題パターンの可視化 - 入力漏れエラーの件数が9件の場合、件数が正確に集計される', () => {
    const missing_field_errors = Array.from({ length: 9 }, (_, index) => ({
      record_id: `REC-${String(index + 1).padStart(3, '0')}`,
      field_name: 'customer_name',
      error_type: 'missing_field',
      detected_at: '2024-01-15T10:00:00Z',
      severity: 'error' as const,
    }));

    const quality_check_results = [
      ...missing_field_errors,
      {
        record_id: 'REC-010',
        field_name: 'email',
        error_type: 'invalid_format',
        detected_at: '2024-01-15T10:05:00Z',
        severity: 'error' as const,
      },
      {
        record_id: 'REC-011',
        field_name: 'phone',
        error_type: 'duplicate_entry',
        detected_at: '2024-01-15T10:10:00Z',
        severity: 'warning' as const,
      },
    ];

    const visualization_result = detectAndVisualizeDataQualityIssues({
      quality_check_results: quality_check_results,
    });

    expect(visualization_result.problem_pattern_summary).toEqual({
      missing_field: 9,
      invalid_format: 1,
      duplicate_entry: 1,
    });

    expect(visualization_result.total_issues_detected).toBe(11);

    expect(visualization_result.issue_breakdown).toEqual([
      {
        error_type: 'missing_field',
        count: 9,
        percentage: 81.82,
      },
      {
        error_type: 'invalid_format',
        count: 1,
        percentage: 9.09,
      },
      {
        error_type: 'duplicate_entry',
        count: 1,
        percentage: 9.09,
      },
    ]);

    expect(visualization_result.severity_distribution).toEqual({
      error: 10,
      warning: 1,
    });
  });
});