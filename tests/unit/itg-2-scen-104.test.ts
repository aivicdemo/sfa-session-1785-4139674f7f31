import { detectDuplicateCustomers } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-104
  test('[normal] 顧客名が一致し電話番号も一致する場合、非常に高い確度で重複と判定される', () => {
    const customer_a = {
      customer_id: 'CUST001',
      customer_name: '山田太郎',
      phone_number: '090-1234-5678',
      email: 'yamada@example.com',
      address: '東京都渋谷区1-1-1'
    };

    const customer_b = {
      customer_id: 'CUST002',
      customer_name: '山田太郎',
      phone_number: '090-1234-5678',
      email: 'yamada.taro@example.com',
      address: '東京都渋谷区1-1-1'
    };

    const result = detectDuplicateCustomers(customer_a, customer_b);

    expect(result.confidence_score).toBeGreaterThanOrEqual(0.95);
    expect(result.duplicate_status).toBe('HIGH_CONFIDENCE_DUPLICATE');
  });
});