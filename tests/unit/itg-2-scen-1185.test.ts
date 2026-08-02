import { integrateCustomerDuplicates } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  test('SCEN-1185: 重複する顧客データを新しいレコード優先で統合した場合、新しいレコードの主要属性が統合後のデータに残される', () => {
    const oldRecord = {
      customerId: 'CUST-001',
      createdAt: new Date('2023-01-15T00:00:00Z'),
      companyName: 'ABC Corporation',
      phone: '090-1111-1111',
    };

    const newRecord = {
      customerId: 'CUST-001',
      createdAt: new Date('2024-01-15T00:00:00Z'),
      companyName: 'ABC Corp Updated',
      phone: '090-2222-2222',
    };

    const result = integrateCustomerDuplicates(
      [oldRecord, newRecord],
      { preferNewerRecord: true }
    );

    expect(result.companyName).toBe('ABC Corp Updated');
    expect(result.phone).toBe('090-2222-2222');
    expect(result.createdAt).toEqual(new Date('2024-01-15T00:00:00Z'));
  });
});