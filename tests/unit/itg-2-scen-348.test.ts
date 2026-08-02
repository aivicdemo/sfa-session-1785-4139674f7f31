import { detectDuplicateCustomers } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データ重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-348
  test('[normal] メールアドレスが完全一致している場合、重複候補スコアが加算される', () => {
    const customer_a = {
      id: 'cust_001',
      name: '山田太郎',
      email: 'user@example.com',
      phone: '090-1234-5678',
      company: '株式会社ABC',
      created_at: new Date('2024-01-10T09:00:00Z'),
    };

    const customer_b = {
      id: 'cust_002',
      name: '山田太朗',
      email: 'user@example.com',
      phone: '090-1234-5679',
      company: '株式会社ABC',
      created_at: new Date('2024-01-11T10:00:00Z'),
    };

    const result = detectDuplicateCustomers([customer_a, customer_b]);

    expect(result).toHaveLength(1);
    expect(result[0]).toEqual(
      expect.objectContaining({
        customer_id_1: 'cust_001',
        customer_id_2: 'cust_002',
        duplicate_score: expect.any(Number),
      })
    );
    expect(result[0].duplicate_score).toBeGreaterThanOrEqual(0.3);
  });
});