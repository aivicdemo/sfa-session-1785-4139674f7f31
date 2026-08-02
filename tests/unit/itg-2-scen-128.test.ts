import { detectDuplicateCustomers } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-128
  test('検査対象の顧客レコードが複数件のとき、重複候補が検出される', () => {
    const input_customers = [
      {
        customer_id: 'CUST001',
        company_name: 'ABC Corporation',
        address: '東京都渋谷区',
        phone_number: '03-1234-5678',
        email: 'contact@abc.co.jp',
      },
      {
        customer_id: 'CUST002',
        company_name: 'ABC Corp',
        address: '東京都渋谷区',
        phone_number: '03-1234-5678',
        email: 'info@abc-corp.jp',
      },
      {
        customer_id: 'CUST003',
        company_name: 'XYZ Limited',
        address: '大阪府大阪市',
        phone_number: '06-9876-5432',
        email: 'support@xyz.co.jp',
      },
    ];

    const result = detectDuplicateCustomers(input_customers);

    expect(result).toBeDefined();
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThanOrEqual(1);

    const duplicate_pair = result[0];
    expect(duplicate_pair).toHaveProperty('record_id_1');
    expect(duplicate_pair).toHaveProperty('record_id_2');
    expect(duplicate_pair).toHaveProperty('match_score');
    expect(duplicate_pair).toHaveProperty('matched_fields');

    expect(typeof duplicate_pair.record_id_1).toBe('string');
    expect(typeof duplicate_pair.record_id_2).toBe('string');
    expect(typeof duplicate_pair.match_score).toBe('number');
    expect(Array.isArray(duplicate_pair.matched_fields)).toBe(true);

    expect(duplicate_pair.match_score).toBeGreaterThanOrEqual(0);
    expect(duplicate_pair.match_score).toBeLessThanOrEqual(100);

    const expected_record_ids = ['CUST001', 'CUST002'];
    expect(
      (duplicate_pair.record_id_1 === expected_record_ids[0] &&
        duplicate_pair.record_id_2 === expected_record_ids[1]) ||
        (duplicate_pair.record_id_1 === expected_record_ids[1] &&
          duplicate_pair.record_id_2 === expected_record_ids[0])
    ).toBe(true);

    expect(duplicate_pair.match_score).toBeGreaterThanOrEqual(70);
    expect(duplicate_pair.matched_fields.length).toBeGreaterThanOrEqual(1);
    expect(
      duplicate_pair.matched_fields.includes('company_name') ||
        duplicate_pair.matched_fields.includes('address') ||
        duplicate_pair.matched_fields.includes('phone_number')
    ).toBe(true);
  });
});