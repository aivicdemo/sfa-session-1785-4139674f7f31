import { detectDuplicateCustomersAndJudge } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-168
  test('統合判定履歴に統合判定のタイムスタンプが正しく記録される', async () => {
    const mockTimestamp = new Date('2024-01-15T10:30:45.123Z');
    const originalNow = Date.now;
    Date.now = jest.fn(() => mockTimestamp.getTime());

    try {
      const customer1 = {
        customer_id: 'CUST001',
        customer_name: '株式会社テスト',
        email: 'test@example.com',
        phone: '090-1234-5678',
        address: '東京都渋谷区',
      };

      const customer2 = {
        customer_id: 'CUST002',
        customer_name: 'テスト株式会社',
        email: 'test@example.com',
        phone: '090-1234-5678',
        address: '東京都渋谷区',
      };

      const result = await detectDuplicateCustomersAndJudge([customer1, customer2]);

      expect(result).toBeDefined();
      expect(result.judgment_timestamp).toBe('2024-01-15T10:30:45.123Z');
      expect(result.judgment_timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
    } finally {
      Date.now = originalNow;
    }
  });
});