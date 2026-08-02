import { detectAndJudgeDuplicateCustomers } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-397
  test('統合判定で確度100%と判定された顧客ペアが返される', () => {
    const customerA1 = {
      customer_id: 'CUST-001',
      name: '山田太郎',
      email: 'yamada.taro@example.com',
      phone: '090-1234-5678',
      address: '東京都渋谷区1-1-1',
    };

    const customerA2 = {
      customer_id: 'CUST-002',
      name: '山田太郎',
      email: 'yamada.taro@example.com',
      phone: '090-1234-5678',
      address: '東京都渋谷区1-1-1',
    };

    const result = detectAndJudgeDuplicateCustomers([customerA1, customerA2]);

    expect(result).toEqual(
      expect.objectContaining({
        duplicate_pairs: expect.arrayContaining([
          expect.objectContaining({
            primary_customer_id: 'CUST-001',
            duplicate_customer_id: 'CUST-002',
            confidence_score: 100,
            should_merge: true,
          }),
        ]),
      })
    );

    const duplicatePair = result.duplicate_pairs[0];
    expect(duplicatePair.confidence_score).toBe(100);
    expect(duplicatePair.should_merge).toBe(true);
  });
});