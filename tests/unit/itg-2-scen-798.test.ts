import { detectDuplicateCustomers } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-798
  test('[normal] 顧客データ重複・不整合検出機能 - 顧客名の完全一致が検出され、重複度スコアが最高値として計算される', () => {
    const customerA = {
      id: 'CUST-001',
      name: '山田太郎',
      address: '東京都渋谷区',
      phone: '090-1234-5678',
    };

    const customerB = {
      id: 'CUST-002',
      name: '山田太郎',
      address: '大阪府大阪市',
      phone: '090-9999-9999',
    };

    const result = detectDuplicateCustomers([customerA, customerB]);

    expect(result).toEqual(
      expect.objectContaining({
        duplicates: expect.arrayContaining([
          expect.objectContaining({
            customerIdA: 'CUST-001',
            customerIdB: 'CUST-002',
            score: 100,
            matchedFields: expect.arrayContaining(['name']),
          }),
        ]),
      })
    );

    const duplicatePair = result.duplicates.find(
      (d: { customerIdA: string; customerIdB: string }) =>
        (d.customerIdA === 'CUST-001' && d.customerIdB === 'CUST-002') ||
        (d.customerIdA === 'CUST-002' && d.customerIdB === 'CUST-001')
    );

    expect(duplicatePair).toBeDefined();
    expect(duplicatePair.score).toBe(100);
    expect(duplicatePair.matchedFields).toContain('name');
  });
});