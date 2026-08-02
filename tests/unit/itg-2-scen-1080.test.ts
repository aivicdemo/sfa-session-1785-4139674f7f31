import { detectCustomerDuplicates } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データ重複判定・統合エンジン', () => {
  test('SCEN-1080: 重複候補顧客が複数件のとき、各件に対して重複判定が実施される', () => {
    const input_customer_id = 'CUST-001';
    const duplicate_candidates = [
      {
        customer_id: 'CUST-002',
        customer_name: '株式会社テスト太郎',
        customer_code: 'TST-0002',
        industry_code: 'IT',
        capital: 50000000,
        employee_count: 100,
        representative_name: 'テスト太郎',
        address: '東京都渋谷区1-1-1',
        phone_number: '03-1234-5678',
        email: 'test@example.com',
        registration_date: '2024-01-01T00:00:00Z',
        last_update_date: '2024-01-15T00:00:00Z',
      },
      {
        customer_id: 'CUST-003',
        customer_name: '株式会社テスト太郎商事',
        customer_code: 'TST-0003',
        industry_code: 'IT',
        capital: 50000000,
        employee_count: 100,
        representative_name: 'テスト太郎',
        address: '東京都渋谷区1-1-2',
        phone_number: '03-1234-5679',
        email: 'test.shoji@example.com',
        registration_date: '2024-01-02T00:00:00Z',
        last_update_date: '2024-01-16T00:00:00Z',
      },
      {
        customer_id: 'CUST-004',
        customer_name: 'テスト太郎株式会社',
        customer_code: 'TST-0004',
        industry_code: 'IT',
        capital: 50000000,
        employee_count: 100,
        representative_name: 'テスト太郎',
        address: '東京都渋谷区1-1-1',
        phone_number: '03-1234-5678',
        email: 'taro@example.com',
        registration_date: '2024-01-03T00:00:00Z',
        last_update_date: '2024-01-17T00:00:00Z',
      },
    ];

    const result = detectCustomerDuplicates(input_customer_id, duplicate_candidates);

    expect(result).toBeDefined();
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(3);

    result.forEach((judgment_result: any, index: number) => {
      expect(judgment_result).toHaveProperty('customer_id');
      expect(judgment_result).toHaveProperty('duplicate_score');
      expect(judgment_result).toHaveProperty('judgment_status');

      expect(typeof judgment_result.customer_id).toBe('string');
      expect(judgment_result.customer_id).toBe(duplicate_candidates[index].customer_id);

      expect(typeof judgment_result.duplicate_score).toBe('number');
      expect(judgment_result.duplicate_score).toBeGreaterThanOrEqual(0.0);
      expect(judgment_result.duplicate_score).toBeLessThanOrEqual(1.0);

      expect(typeof judgment_result.judgment_status).toBe('string');
      expect(['duplicate', 'non_duplicate']).toContain(judgment_result.judgment_status);
    });

    expect(result[0].duplicate_score).toBeGreaterThan(0.7);
    expect(['duplicate', 'non_duplicate']).toContain(result[0].judgment_status);

    expect(result[1].duplicate_score).toBeGreaterThan(0.5);
    expect(['duplicate', 'non_duplicate']).toContain(result[1].judgment_status);

    expect(result[2].duplicate_score).toBeGreaterThan(0.8);
    expect(['duplicate', 'non_duplicate']).toContain(result[2].judgment_status);
  });
});