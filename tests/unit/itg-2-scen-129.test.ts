import { detectDuplicateCustomers } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-129
  test('顧客名が完全一致する2レコードが重複候補として検出される', () => {
    const recordA = {
      customer_id: 'CUST001',
      customer_name: '山田太郎',
      address: '東京都渋谷区',
      phone: '090-1234-5678',
    };

    const recordB = {
      customer_id: 'CUST002',
      customer_name: '山田太郎',
      address: '大阪府大阪市',
      phone: '090-9876-5432',
    };

    const duplicateCustomers = [recordA, recordB];

    const result = detectDuplicateCustomers(duplicateCustomers);

    expect(result).toEqual(
      expect.objectContaining({
        is_duplicate: true,
        duplicate_score: expect.any(Number),
        duplicate_reason: '顧客名が完全一致',
        recommended_action: '統合候補',
        record_pair: expect.arrayContaining([
          expect.objectContaining({
            customer_id: 'CUST001',
            customer_name: '山田太郎',
          }),
          expect.objectContaining({
            customer_id: 'CUST002',
            customer_name: '山田太郎',
          }),
        ]),
      })
    );

    expect(result.duplicate_score).toBeGreaterThanOrEqual(80);
  });
});