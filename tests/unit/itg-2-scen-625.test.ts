import { detectAndMergeCustomerDuplicates } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-625
  test('複数の判定基準がすべて一致する場合、確度100%で重複と判定される', () => {
    const customerA = {
      customer_id: 'CUST001',
      name: '山田太郎',
      address: '東京都渋谷区1-1',
      phone: '090-1234-5678',
      email: 'yamada@example.com',
    };

    const customerB = {
      customer_id: 'CUST002',
      name: '山田太郎',
      address: '東京都渋谷区1-1',
      phone: '090-1234-5678',
      email: 'yamada@example.com',
    };

    const result = detectAndMergeCustomerDuplicates([customerA, customerB]);

    expect(result).toEqual({
      is_duplicate: true,
      confidence_score: 100,
      matching_criteria: {
        name_match: true,
        address_match: true,
        phone_match: true,
        email_match: true,
      },
      merge_decision: 'approved',
      primary_customer_id: 'CUST001',
      duplicate_customer_id: 'CUST002',
    });
  });
});