import { detectDuplicateCustomers } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  test('SCEN-566: 信頼度スコア計算に使用されるマッチング項目の重み付けが正しく適用される', () => {
    const recordA = {
      customer_id: 'CUST001',
      customer_name: '株式会社太郎商事',
      email: 'info@taroushoji.com',
      phone_number: '090-1234-5678',
      address: '東京都渋谷区',
      created_at: new Date('2024-01-15T11:00:00Z'),
      updated_at: new Date('2024-01-15T11:00:00Z'),
    };

    const recordB = {
      customer_id: 'CUST002',
      customer_name: '株式会社太郎商事',
      email: 'info@taroushoji.com',
      phone_number: '090-9876-5432',
      address: '東京都新宿区',
      created_at: new Date('2024-01-16T10:00:00Z'),
      updated_at: new Date('2024-01-16T10:00:00Z'),
    };

    const result = detectDuplicateCustomers([recordA, recordB]);

    expect(result).toBeDefined();
    expect(result.length).toBeGreaterThan(0);

    const duplicateMatch = result.find(
      (item) =>
        (item.primary_customer_id === recordA.customer_id &&
          item.duplicate_customer_id === recordB.customer_id) ||
        (item.primary_customer_id === recordB.customer_id &&
          item.duplicate_customer_id === recordA.customer_id)
    );

    expect(duplicateMatch).toBeDefined();
    expect(duplicateMatch?.confidence_score).toBe(0.75);
    expect(duplicateMatch?.matching_details).toEqual({
      customer_name_match_score: 1.0,
      email_match_score: 1.0,
      phone_number_match_score: 0.0,
      address_match_score: 0.0,
      customer_name_weight: 0.4,
      email_weight: 0.35,
      phone_number_weight: 0.15,
      address_weight: 0.1,
    });
  });
});