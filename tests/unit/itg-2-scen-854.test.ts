import { detectDuplicateCustomers } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  test('SCEN-854: 重複候補顧客が1件のとき、重複検出結果が1件で返される', () => {
    // Arrange
    const customerDatabase = [
      {
        customerId: 'C001',
        name: '株式会社A',
        address: '東京都渋谷区',
        phone: '03-0000-0001',
      },
      {
        customerId: 'C002',
        name: '株式会社エー',
        address: '東京都渋谷区渋谷',
        phone: '03-00-0001',
      },
      {
        customerId: 'C003',
        name: '株式会社B',
        address: '大阪府大阪市',
        phone: '06-0000-0002',
      },
    ];

    // Act
    const result = detectDuplicateCustomers(customerDatabase);

    // Assert
    expect(result.duplicateCandidates).toHaveLength(1);
    expect(result.duplicateCandidates[0]).toEqual({
      customer1Id: 'C001',
      customer2Id: 'C002',
      duplicateScore: expect.any(Number),
    });
    expect(result.duplicateCandidates[0].duplicateScore).toBeGreaterThan(0);
    expect(result.duplicateCandidates[0].duplicateScore).toBeLessThanOrEqual(1);
  });
});