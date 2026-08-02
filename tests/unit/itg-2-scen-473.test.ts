import { detectDuplicateCustomers } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  test('SCEN-473: 重複判定の信頼度スコアが閾値を超える場合、重複と判定される', () => {
    // Arrange: 重複検出対象の顧客データを準備
    const customerA = {
      customerId: 'CUST-001',
      name: '山田太郎',
      email: 'yamada@example.com',
      phone: '090-1234-5678',
      address: '東京都渋谷区',
    };

    const customerB = {
      customerId: 'CUST-002',
      name: '山田太朗',
      email: 'yamada.taro@example.com',
      phone: '090-1234-5678',
      address: '東京都渋谷区',
    };

    // Act: 重複検出関数を実行
    const result = detectDuplicateCustomers(customerA, customerB);

    // Assert: 重複判定結果を検証
    expect(result.status).toBe('重複と判定');
    expect(result.confidenceScore).toBeGreaterThanOrEqual(0.85);
    expect(result.confidenceScore).toBe(0.92);
    expect(result.duplicateCustomerId).toBe('CUST-002');
    expect(result.masterCustomerId).toBe('CUST-001');
  });
});