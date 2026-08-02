import { calculateDuplicateJudgmentScore } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-211
  test('住所が部分一致するとき、重複判定スコアが中程度となる', () => {
    const customer_a = {
      customer_id: 'CUST001',
      name: '顧客A',
      address: '東京都渋谷区道玄坂1-2-3',
      phone: '09012345678',
      email: 'customer.a@example.com'
    };

    const customer_b = {
      customer_id: 'CUST002',
      name: '顧客B',
      address: '東京都渋谷区道玄坂1-2',
      phone: '09087654321',
      email: 'customer.b@example.com'
    };

    const score = calculateDuplicateJudgmentScore(customer_a, customer_b);

    expect(score).toBeGreaterThanOrEqual(40);
    expect(score).toBeLessThanOrEqual(60);
    expect(score).toBe(50);
  });
});