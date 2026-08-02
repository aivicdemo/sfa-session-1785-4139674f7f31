import { detectAndVisualizeInconsistencies } from '../../src/logic/it-1-br-2-1-2-1';

describe('営業データ品質検証エンジンの構築', () => {
  // SCEN-1199
  test('検出問題パターンの可視化 - 不整合エラーの件数が4件の場合、件数が正確に集計される', () => {
    const inconsistency_error_records = [
      {
        id: 'err_001',
        customer_id: 'cust_1001',
        error_type: 'data_mismatch',
        field_name: 'phone_number',
        expected_value: '09012345678',
        actual_value: '090-1234-5678',
        detected_at: '2024-01-15T10:30:00Z',
      },
      {
        id: 'err_002',
        customer_id: 'cust_1002',
        error_type: 'data_mismatch',
        field_name: 'email',
        expected_value: 'user@example.com',
        actual_value: 'user@example.jp',
        detected_at: '2024-01-15T10:35:00Z',
      },
      {
        id: 'err_003',
        customer_id: 'cust_1003',
        error_type: 'data_mismatch',
        field_name: 'postal_code',
        expected_value: '1000001',
        actual_value: '100-0001',
        detected_at: '2024-01-15T10:40:00Z',
      },
      {
        id: 'err_004',
        customer_id: 'cust_1004',
        error_type: 'data_mismatch',
        field_name: 'company_name',
        expected_value: '株式会社ABC',
        actual_value: 'ABC Inc.',
        detected_at: '2024-01-15T10:45:00Z',
      },
    ];

    const visualization_result = detectAndVisualizeInconsistencies(
      inconsistency_error_records
    );

    expect(visualization_result.inconsistency_count).toBe(4);
  });
});