import { detectDuplicateCustomers } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化 - 電話番号欠損時の重複判定', () => {
  // SCEN-1044
  test('電話番号が欠けている場合に重複判定で電話番号項目が除外される', () => {
    const customerA = {
      id: 'CUST-001',
      name: '山田太郎',
      email: 'yamada@example.com',
      phone_number: '',
    };

    const customerB = {
      id: 'CUST-002',
      name: '山田太郎',
      email: 'yamada@example.com',
      phone_number: '09012345678',
    };

    const result = detectDuplicateCustomers([customerA, customerB]);

    expect(result.is_duplicate).toBe(true);
    expect(result.comparison_fields).toEqual(['name', 'email']);
    expect(result.comparison_fields).not.toContain('phone_number');
    expect(result.system_log).toMatch(/電話番号項目は欠損値を含むため除外/);
    expect(result.matched_fields).toEqual(['name', 'email']);
  });
});