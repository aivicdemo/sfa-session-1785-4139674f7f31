import { detectDuplicateCustomers } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-645
  test('[normal] 正規化ルール設定がない場合、正規化処理がスキップされる', () => {
    const input_customer = {
      customer_id: 'CUST001',
      customer_name: '株式会社 ABC',
      phone_number: '03-1234-5678',
      address: '東京都渋谷区',
    };

    const normalization_rules: any[] = [];

    const result = detectDuplicateCustomers({
      customer: input_customer,
      normalization_rules: normalization_rules,
      duplicate_detection_rules: [],
    });

    expect(result).toEqual({
      normalized_customer: {
        customer_id: 'CUST001',
        customer_name: '株式会社 ABC',
        phone_number: '03-1234-5678',
        address: '東京都渋谷区',
      },
      normalization_applied: false,
      duplicate_candidates: [],
      processing_log: expect.stringContaining('normalization'),
    });

    expect(result.normalized_customer.customer_name).toBe('株式会社 ABC');
    expect(result.normalized_customer.phone_number).toBe('03-1234-5678');
    expect(result.normalization_applied).toBe(false);
  });
});