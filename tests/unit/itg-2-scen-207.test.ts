import { detectDuplicateCustomersAndRecommendMerge } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-207
  test('重複判定スコアが閾値より1高いとき、統合推奨判定がYESとなる', () => {
    const customerA = {
      customerId: 'CUST001',
      customerName: '山田太郎',
      email: 'yamada@example.com',
    };

    const customerB = {
      customerId: 'CUST002',
      customerName: '山田太郎',
      email: 'yamada.taro@example.com',
    };

    const threshold = 80;
    const expectedDuplicateScore = 81;

    const result = detectDuplicateCustomersAndRecommendMerge(
      customerA,
      customerB,
      threshold
    );

    expect(result.duplicateScore).toBe(expectedDuplicateScore);
    expect(result.mergeRecommendation).toBe(true);
  });
});