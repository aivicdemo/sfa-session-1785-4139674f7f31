import { detectDataInconsistencies } from '../../src/logic/it-1-br-2-1-2-1';

describe('営業データ品質検証エンジン', () => {
  // SCEN-1197
  test('検出問題パターンの可視化 - 不整合エラーの件数がちょうど3件の場合、件数が正確に集計される', () => {
    const mock_inconsistency_logs = [
      {
        id: 'log_001',
        customer_id: 'cust_101',
        error_type: 'inconsistency',
        error_content: 'Customer name mismatch between master and transaction',
        detected_at: new Date('2024-01-15T10:00:00Z'),
        severity: 'high',
      },
      {
        id: 'log_002',
        customer_id: 'cust_102',
        error_type: 'inconsistency',
        error_content: 'Phone number format invalid',
        detected_at: new Date('2024-01-15T10:15:00Z'),
        severity: 'medium',
      },
      {
        id: 'log_003',
        customer_id: 'cust_103',
        error_type: 'inconsistency',
        error_content: 'Address field missing in CRM system',
        detected_at: new Date('2024-01-15T10:30:00Z'),
        severity: 'high',
      },
    ];

    const result = detectDataInconsistencies({
      inconsistency_logs: mock_inconsistency_logs,
    });

    expect(result.inconsistency_count).toBe(3);
    expect(result.problem_patterns).toEqual(
      expect.objectContaining({
        inconsistency_error_count: 3,
      })
    );
  });
});