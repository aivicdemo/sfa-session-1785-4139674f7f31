import { detectDuplicateCustomers } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-455
  test('[normal] 顧客データ重複検出と統合判定 - 全ての属性が異なる場合、重複と判定されない', () => {
    const customerA = {
      customer_id: 'A001',
      customer_name: '山田太郎',
      email: 'yamada@example.com',
      phone: '090-1234-5678',
      address: '東京都渋谷区',
    };

    const customerB = {
      customer_id: 'B001',
      customer_name: '田中花子',
      email: 'tanaka@example.com',
      phone: '090-9876-5432',
      address: '大阪府大阪市',
    };

    const result = detectDuplicateCustomers(customerA.customer_id, customerB.customer_id, [customerA, customerB]);

    expect(result.is_duplicate).toBe(false);
    expect(result.merge_required).toBe(false);
    expect(result.duplicate_score).toBe(0.0);
  });
});