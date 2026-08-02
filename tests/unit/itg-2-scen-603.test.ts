import { validateSalesDataQuality } from '../../src/logic/it-1-br-2-1-2-1';

describe('営業データ品質検証エンジン', () => {
  test('SCEN-603: 妥当性検証で日付形式がISO8601形式の場合、合格と判定される', () => {
    const salesData = {
      customerId: 'CUST001',
      customerName: '株式会社ABC',
      contactDate: '2024-01-15',
      lastPurchaseDate: '2024-01-10',
      email: 'contact@abc.com',
      phone: '03-1234-5678',
      status: 'active'
    };

    const result = validateSalesDataQuality(salesData);

    expect(result.status).toBe('合格');
    expect(result.errorMessages).toEqual([]);
  });
});