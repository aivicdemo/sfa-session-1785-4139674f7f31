import { detectAndVisualizeQualityIssues } from '../../src/logic/it-1-br-2-1-2-1';

describe('営業データ品質検証エンジン', () => {
  // SCEN-1189
  test('[normal] 検出問題パターンの可視化 - 検証エラーが複数件の場合、全件数と同じ数の問題パターンが返される', () => {
    const validation_error_1 = {
      record_id: 'REC-001',
      field_name: 'customer_name',
      error_type: 'empty',
      error_message: '顧客名が空白です',
      detected_at: '2024-01-15T10:30:00Z',
    };

    const validation_error_2 = {
      record_id: 'REC-002',
      field_name: 'phone_number',
      error_type: 'format_invalid',
      error_message: '電話番号の形式が不正です',
      detected_at: '2024-01-15T10:31:00Z',
    };

    const validation_error_3 = {
      record_id: 'REC-003',
      field_name: 'email_address',
      error_type: 'duplicate',
      error_message: 'メールアドレスが重複しています',
      detected_at: '2024-01-15T10:32:00Z',
    };

    const input_validation_errors = [validation_error_1, validation_error_2, validation_error_3];

    const result = detectAndVisualizeQualityIssues(input_validation_errors);

    expect(result.issue_pattern_count).toBe(3);
    expect(result.issue_patterns).toHaveLength(3);

    expect(result.issue_patterns[0]).toMatchObject({
      record_id: 'REC-001',
      field_name: 'customer_name',
      error_type: 'empty',
      error_message: '顧客名が空白です',
    });

    expect(result.issue_patterns[1]).toMatchObject({
      record_id: 'REC-002',
      field_name: 'phone_number',
      error_type: 'format_invalid',
      error_message: '電話番号の形式が不正です',
    });

    expect(result.issue_patterns[2]).toMatchObject({
      record_id: 'REC-003',
      field_name: 'email_address',
      error_type: 'duplicate',
      error_message: 'メールアドレスが重複しています',
    });

    expect(result.visualization_timestamp).toBeDefined();
  });
});