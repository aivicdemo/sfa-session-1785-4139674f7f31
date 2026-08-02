import { detectDuplicateCustomers } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-1088
  test('[normal] 顧客データ重複判定・統合エンジン - メールアドレスが完全一致し他属性も一致するとき、重複と判定される', () => {
    const customerA = {
      customer_id: 'CUST_001',
      email: 'test@example.com',
      customer_name: '山田太郎',
      address: '東京都渋谷区',
      phone_number: '090-1234-5678',
      created_at: new Date('2024-01-01T00:00:00Z'),
      updated_at: new Date('2024-01-01T00:00:00Z'),
    };

    const customerB = {
      customer_id: 'CUST_002',
      email: 'test@example.com',
      customer_name: '山田太郎',
      address: '東京都渋谷区',
      phone_number: '090-1234-5678',
      created_at: new Date('2024-01-02T00:00:00Z'),
      updated_at: new Date('2024-01-02T00:00:00Z'),
    };

    const result = detectDuplicateCustomers([customerA, customerB]);

    expect(result.is_duplicate).toBe(true);
    expect(result.match_groups).toHaveLength(1);
    expect(result.match_groups[0].customer_ids).toContain(customerA.customer_id);
    expect(result.match_groups[0].customer_ids).toContain(customerB.customer_id);
    expect(result.match_groups[0].match_score).toBe(100);
  });
});