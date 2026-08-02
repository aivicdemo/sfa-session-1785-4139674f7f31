import { detectDuplicateCustomers } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-255
  test('[normal] 顧客データ重複検出機能 - 重複候補データが同値で並ぶとき、統合判定の順序に関わらず同じ結果が返される', () => {
    const customer_a = {
      id: 'cust_001',
      name: '山田太郎',
      email: 'yamada@example.com',
      phone: '09012345678'
    };

    const customer_b = {
      id: 'cust_002',
      name: '山田太郎',
      email: 'yamada@example.com',
      phone: '09012345678'
    };

    const result_1 = detectDuplicateCustomers(customer_a, customer_b);

    const result_2 = detectDuplicateCustomers(customer_b, customer_a);

    expect(result_1.is_duplicate).toBe(true);
    expect(result_2.is_duplicate).toBe(true);

    expect(result_1.merge_score).toBe(100);
    expect(result_2.merge_score).toBe(100);

    expect(result_1.matching_reason).toBe('name、email、phone一致');
    expect(result_2.matching_reason).toBe('name、email、phone一致');

    expect(result_1).toEqual(result_2);
  });
});