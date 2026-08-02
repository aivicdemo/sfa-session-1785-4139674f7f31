import { mergeCustomers } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-1180
  test('[normal] 顧客データの正規化・統合判定 - 統合判定で重複として判定された2件の顧客データを統合した場合、統合後のデータが1件として返される', () => {
    const customerDataA = {
      customer_id: 'CUST-001',
      company_name: '株式会社テスト',
      phone: '090-1234-5678',
      merge_key: 'test_090_1234_5678',
    };

    const customerDataB = {
      customer_id: 'CUST-002',
      company_name: 'テスト株式会社',
      phone: '090-1234-5678',
      merge_key: 'test_090_1234_5678',
    };

    const result = mergeCustomers(customerDataA, customerDataB);

    expect(result.merged_count).toBe(1);
    expect(result.data).toHaveLength(1);
    expect(result.data[0].customer_id).toBe('CUST-001');
    expect(result.data[0].company_name).toBe('株式会社テスト');
    expect(result.data[0].phone).toBe('090-1234-5678');
    expect(result.data[0].is_merged).toBe(true);
  });
});