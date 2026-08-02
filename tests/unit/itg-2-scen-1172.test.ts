import { detectDuplicateCustomers } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-1172
  test('重複候補が複数件の場合、全件数と同じ数の判定結果が返される', () => {
    const duplicate_candidates = [
      {
        customer_id_1: '001',
        customer_id_2: '002',
        duplicate_score: 0.95,
        detection_reason: 'company_name_match',
        created_at: new Date('2024-01-15T10:00:00Z'),
      },
      {
        customer_id_1: '003',
        customer_id_2: '004',
        duplicate_score: 0.88,
        detection_reason: 'phone_number_match',
        created_at: new Date('2024-01-15T10:05:00Z'),
      },
      {
        customer_id_1: '005',
        customer_id_2: '006',
        duplicate_score: 0.92,
        detection_reason: 'email_match',
        created_at: new Date('2024-01-15T10:10:00Z'),
      },
      {
        customer_id_1: '007',
        customer_id_2: '008',
        duplicate_score: 0.85,
        detection_reason: 'address_match',
        created_at: new Date('2024-01-15T10:15:00Z'),
      },
      {
        customer_id_1: '009',
        customer_id_2: '010',
        duplicate_score: 0.90,
        detection_reason: 'company_name_match',
        created_at: new Date('2024-01-15T10:20:00Z'),
      },
    ];

    const judgment_results = detectDuplicateCustomers(duplicate_candidates);

    expect(judgment_results).toHaveLength(5);

    judgment_results.forEach((result, index) => {
      expect(result).toHaveProperty('customer_id');
      expect(result).toHaveProperty('duplicate_score');
      expect(result).toHaveProperty('judgment_status');

      expect(typeof result.customer_id).toBe('string');
      expect(typeof result.duplicate_score).toBe('number');
      expect(typeof result.judgment_status).toBe('string');

      expect(result.customer_id).toBeTruthy();
      expect(result.duplicate_score).toBeGreaterThanOrEqual(0.85);
      expect(result.duplicate_score).toBeLessThanOrEqual(0.95);
      expect(['pending', 'confirmed', 'rejected']).toContain(result.judgment_status);
    });
  });
});