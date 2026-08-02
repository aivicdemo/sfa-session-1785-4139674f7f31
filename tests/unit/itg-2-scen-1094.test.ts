import { detectDuplicateCustomers } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データ重複判定・統合エンジン', () => {
  // SCEN-1094
  test('[normal] 複数の重複候補が検出され、判定スコアが異なるとき、スコア順に並べられる', () => {
    const existingCustomers = [
      {
        customerId: '1001',
        name: '山田太郎',
        address: '東京都渋谷区道玄坂',
        phone: '090-1234-5678',
        createdAt: '2024-01-01T00:00:00Z',
      },
      {
        customerId: '1002',
        name: '山田太郎',
        address: '東京都渋谷区',
        phone: '090-1234-5679',
        createdAt: '2024-01-02T00:00:00Z',
      },
      {
        customerId: '1003',
        name: '山田太郎',
        address: '東京都渋谷区',
        phone: '090-1234-5678',
        createdAt: '2024-01-03T00:00:00Z',
      },
    ];

    const newCustomerData = {
      name: '山田太郎',
      address: '東京都渋谷区',
      phone: '090-1234-5678',
    };

    const result = detectDuplicateCustomers(existingCustomers, newCustomerData);

    expect(result).toHaveLength(3);
    expect(result[0]).toMatchObject({
      customerId: '1001',
      matchScore: 85,
    });
    expect(result[1]).toMatchObject({
      customerId: '1003',
      matchScore: 72,
    });
    expect(result[2]).toMatchObject({
      customerId: '1002',
      matchScore: 58,
    });
    expect(result[0].matchScore).toBeGreaterThan(result[1].matchScore);
    expect(result[1].matchScore).toBeGreaterThan(result[2].matchScore);
  });
});