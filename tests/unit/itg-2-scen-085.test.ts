import { validateSalesDataQuality } from '../../src/logic/it-1-br-2-1-2-1';

describe('営業データ品質検証エンジン', () => {
  // SCEN-085
  test('許容エラー率がちょうど0%の場合、エラーが1件以上あると品質判定が失敗する', () => {
    const test_data = [
      {
        customer_id: 'C001',
        customer_name: 'テスト顧客A',
        phone_number: '09012345678',
        email: 'customer_a@example.com',
        registration_date: '2024-01-01',
      },
      {
        customer_id: 'C002',
        customer_name: 'テスト顧客B',
        phone_number: '',
        email: 'customer_b@example.com',
        registration_date: '2024-01-02',
      },
      {
        customer_id: 'C003',
        customer_name: 'テスト顧客C',
        phone_number: '09023456789',
        email: 'customer_c@example.com',
        registration_date: '2024-01-03',
      },
    ];

    const tolerance_error_rate = 0;

    const result = validateSalesDataQuality(test_data, tolerance_error_rate);

    expect(result.status).toBe('failed');
    expect(result.error_count).toBe(1);
    expect(result.error_rate).toBe(0.3333);
    expect(result.exceeded_tolerance).toBe(true);
  });
});