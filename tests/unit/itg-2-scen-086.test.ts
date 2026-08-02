import { validateSalesDataQuality } from '../../src/logic/it-1-br-2-1-2-1';

describe('営業データ品質検証エンジン', () => {
  // SCEN-086
  test('許容エラー率が5%の場合、エラー率がちょうど5%で品質判定が合格する', () => {
    const tolerance_error_rate = 5.0;
    const total_records = 100;
    const error_count = 5;
    const expected_error_rate = 5.0;

    const test_data = Array.from({ length: total_records }, (_, index) => ({
      customer_id: `CUST${String(index + 1).padStart(4, '0')}`,
      customer_name: index < error_count ? '' : `Customer${index + 1}`,
      email: index < error_count ? 'invalid-email' : `customer${index + 1}@example.com`,
      phone: `090-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`,
      address: index < error_count ? null : `Address${index + 1}`,
      registration_date: '2024-01-15',
      last_contact_date: '2024-01-20',
    }));

    const result = validateSalesDataQuality({
      records: test_data,
      tolerance_error_rate,
    });

    expect(result.status).toBe('PASSED');
    expect(result.status_code).toBe('PASSED');
    expect(result.calculated_error_rate).toBe(expected_error_rate);
    expect(result.error_count).toBe(error_count);
    expect(result.total_records).toBe(total_records);
  });
});