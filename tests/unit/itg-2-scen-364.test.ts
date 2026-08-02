import { detectDuplicateCustomers } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データ重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-364
  test('同じ顧客ペアで統合判定を2回実行した場合、同じ結果が得られる', () => {
    const customerA = {
      customerId: 'CUST001',
      name: '山田太郎',
      email: 'yamada@example.com',
      phone: '090-1234-5678',
    };

    const customerB = {
      customerId: 'CUST002',
      name: '山田太郎',
      email: 'yamada@example.com',
      phone: '090-1234-5679',
    };

    const firstResult = detectDuplicateCustomers(customerA, customerB);
    const secondResult = detectDuplicateCustomers(customerA, customerB);

    expect(firstResult.matchScore).toBe(secondResult.matchScore);
    expect(firstResult.judgement).toBe(secondResult.judgement);
    expect(firstResult.detectionReason).toBe(secondResult.detectionReason);
    expect(firstResult).toEqual(secondResult);
  });
});