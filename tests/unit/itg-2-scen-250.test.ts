import { detectDuplicateCustomers } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-250
  test('[edge] 類似度が判定閾値直下のとき、統合判定が閾値未満として判定される', () => {
    const similarityThreshold = 0.85;
    const similarityScore = 0.849;

    const customer1 = {
      id: 'cust_001',
      name: 'ABC Corporation',
      email: 'contact@abc.com',
      phone: '090-1234-5678',
      address: 'Tokyo, Japan',
    };

    const customer2 = {
      id: 'cust_002',
      name: 'ABC Corp',
      email: 'info@abc.com',
      phone: '090-1234-5678',
      address: 'Tokyo Japan',
    };

    const result = detectDuplicateCustomers(
      [customer1, customer2],
      similarityThreshold,
      similarityScore,
    );

    expect(result).toBe(false);
  });
});