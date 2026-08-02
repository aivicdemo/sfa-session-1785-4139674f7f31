import { validateCustomerDataQuality } from '../../src/logic/it-1-br-2-1-2-1';

describe('営業データ品質検証エンジンの構築', () => {
  // SCEN-417
  test('[normal] 営業データ品質検証エンジン - 月末の顧客データ入力漏れが検出される', () => {
    const customer_records = [
      {
        customer_id: 'CUST001',
        customer_name: '顧客A',
        address: null,
        phone_number: '090-1111-1111',
      },
      {
        customer_id: 'CUST002',
        customer_name: '顧客B',
        address: '',
        phone_number: '090-2222-2222',
      },
      {
        customer_id: 'CUST003',
        customer_name: '顧客C',
        address: null,
        phone_number: null,
      },
      {
        customer_id: 'CUST004',
        customer_name: '顧客D',
        address: '東京都渋谷区',
        phone_number: null,
      },
      {
        customer_id: 'CUST005',
        customer_name: '顧客E',
        address: '大阪府大阪市',
        phone_number: '090-5555-5555',
      },
    ];

    const validation_date = new Date('2024-01-31T23:59:59Z');

    const result = validateCustomerDataQuality(customer_records, validation_date);

    expect(result.address_missing_count).toBe(3);
    expect(result.phone_number_missing_count).toBe(2);
    expect(result.affected_customer_ids).toEqual([
      'CUST001',
      'CUST002',
      'CUST003',
      'CUST004',
    ]);
    expect(result.validation_status).toBe('FAILED');
    expect(result.is_month_end_validation).toBe(true);
  });
});