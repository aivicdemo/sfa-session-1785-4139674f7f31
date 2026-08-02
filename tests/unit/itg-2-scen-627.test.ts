import { detectDuplicateCustomers } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-627
  test('複数の判定基準がすべて一致しない場合、重複判定されない', () => {
    const customer_a = {
      customer_id: 'CUST001',
      name: '山田太郎',
      email: 'yamada@example.com',
      phone: '090-1234-5678',
      address: '東京都渋谷区',
    };

    const customer_b = {
      customer_id: 'CUST002',
      name: '田中花子',
      email: 'tanaka@example.jp',
      phone: '090-9876-5432',
      address: '大阪府大阪市',
    };

    const duplicate_detection_criteria = {
      name_match: false,
      email_match: false,
      phone_match: false,
      address_match: false,
    };

    const result = detectDuplicateCustomers(
      [customer_a, customer_b],
      duplicate_detection_criteria
    );

    expect(result.is_duplicate).toBe(false);
    expect(result.integration_status).toBe('非重複');
  });
});