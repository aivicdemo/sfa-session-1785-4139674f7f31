import { validateDataConsistency } from '../../src/logic/it-1-br-2-1-2-1';

describe('営業データ品質検証エンジン', () => {
  // SCEN-596
  test('一貫性検証で郵便番号と都道府県の形式が矛盾する場合、不合格と判定される', () => {
    const test_data = {
      postal_code: '100-0001',
      prefecture: '大阪府',
      customer_id: 'CUST001',
      customer_name: 'テスト顧客',
    };

    const result = validateDataConsistency(test_data);

    expect(result.is_valid).toBe(false);
    expect(result.error_code).toBe('CONSISTENCY_MISMATCH_POSTAL_PREFECTURE');
    expect(result.error_message).toMatch(/郵便番号/);
    expect(result.error_message).toMatch(/100-0001/);
    expect(result.error_message).toMatch(/大阪府/);
    expect(result.error_message).toMatch(/矛盾/);
  });
});