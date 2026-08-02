import { detectDuplicateCustomers } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化 - 郵便番号除外ロジック', () => {
  // SCEN-1045
  test('郵便番号が空文字列の場合、重複判定で郵便番号項目が除外される', () => {
    const customer_record_1 = {
      customer_id: 'C001',
      customer_name: '山田太郎',
      address: '東京都渋谷区',
      postal_code: '',
    };

    const customer_record_2 = {
      customer_id: 'C002',
      customer_name: '山田太郎',
      address: '東京都渋谷区',
      postal_code: '150-0001',
    };

    const result = detectDuplicateCustomers([customer_record_1, customer_record_2]);

    expect(result.is_duplicate).toBe(true);
    expect(result.duplicate_group_id).toBeDefined();
    expect(result.excluded_fields).toContain('postal_code');
    expect(result.comparison_fields_used).not.toContain('postal_code');
  });
});