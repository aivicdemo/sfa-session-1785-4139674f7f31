import { detectDuplicateAndInconsistencyCustomerData } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-821
  test('統合判定の処理対象期間が月初から月末の場合、全期間のデータが正しく処理される', () => {
    const period_start = new Date('2024-01-01T00:00:00Z');
    const period_end = new Date('2024-01-31T23:59:59Z');

    const mock_customer_data = Array.from({ length: 100 }, (_, i) => ({
      customer_id: `CUST_${String(i + 1).padStart(3, '0')}`,
      customer_name: `Customer_${i + 1}`,
      email: i < 20 ? `duplicate_${Math.floor(i / 2)}@example.com` : `customer_${i + 1}@example.com`,
      phone: i < 15 ? `090-0000-${String(Math.floor(i / 2)).padStart(4, '0')}` : `090-${String(i + 1).padStart(7, '0')}`,
      address: i < 15 ? '' : `Address_${i + 1}`,
      created_at: new Date(2024, 0, Math.floor(Math.random() * 31) + 1),
      is_duplicate: i < 20,
      has_inconsistency: i >= 20 && i < 35,
      data_quality_status: 'pending',
    }));

    const result = detectDuplicateAndInconsistencyCustomerData({
      period_start,
      period_end,
      customer_records: mock_customer_data,
    });

    expect(result.processing_period.start).toEqual(period_start);
    expect(result.processing_period.end).toEqual(period_end);
    expect(result.total_records_processed).toBe(100);
    expect(result.duplicate_records_detected).toBe(20);
    expect(result.inconsistency_records_detected).toBe(15);
    expect(result.processing_status).toBe('completed');
    expect(result.processing_log).toBeDefined();
    expect(result.processing_log.length).toBeGreaterThan(0);
  });
});