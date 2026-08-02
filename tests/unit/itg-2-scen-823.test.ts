import { detectDuplicateAndInconsistency } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-823
  test('不整合ログが0件の場合、データ品質検証結果が「正常」として記録される', () => {
    const customer_master_data = [
      {
        customer_id: 'CUST001',
        customer_name: '株式会社太郎商事',
        postal_code: '100-0001',
        address: '東京都千代田区丸の内1-1-1',
        phone_number: '03-1234-5678',
        email: 'info@tarou.co.jp',
        industry: 'IT',
        employee_count: 50,
        annual_revenue: 100000000,
        registration_date: '2024-01-15',
        last_updated: '2024-06-01',
      },
    ];

    const inconsistency_logs: Array<{
      customer_id: string;
      inconsistency_type: string;
      detected_value: string;
      expected_value: string;
      severity: string;
    }> = [];

    const data_quality_rules = [
      {
        rule_id: 'RULE_001',
        rule_name: '郵便番号形式チェック',
        validation_logic: 'postal_code_format',
        severity: 'HIGH',
      },
    ];

    const result = detectDuplicateAndInconsistency(
      customer_master_data,
      inconsistency_logs,
      data_quality_rules,
    );

    expect(result.quality_status).toBe('正常');
    expect(result.inconsistency_count).toBe(0);
    expect(result.duplicate_count).toBe(0);
    expect(result.validation_result_id).toBeDefined();
    expect(result.validation_result_id).toMatch(/^VR\d{10}$/);
    expect(result.detected_issues).toEqual([]);
    expect(result.execution_datetime).toMatch(
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/,
    );
  });
});