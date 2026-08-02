import { detectDuplicateCustomers } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-200
  test('[normal] 顧客データ重複・不整合検出機能 - メールアドレスが異なるとき、重複判定スコアが低下する', () => {
    const customer_a = {
      customer_id: 'CUST001',
      name: '田中太郎',
      phone: '09012345678',
      email: 'tanaka@example.com',
    };

    const customer_b = {
      customer_id: 'CUST002',
      name: '田中太郎',
      phone: '09012345678',
      email: 'yamada@example.com',
    };

    const result = detectDuplicateCustomers(customer_a, customer_b);

    expect(result.duplicate_score).toBeGreaterThanOrEqual(70);
    expect(result.duplicate_score).toBeLessThan(90);
  });
});