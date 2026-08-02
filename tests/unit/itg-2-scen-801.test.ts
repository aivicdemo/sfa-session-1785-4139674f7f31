import { detectDuplicateCustomers } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-801
  test('電話番号が完全一致する重複候補の重複度スコアが加算される', () => {
    const customerA = {
      customer_id: 'CUST_001',
      customer_name: '顧客A',
      phone_number: '09012345678',
      email: 'customerA@example.com',
      duplicate_score: 0,
    };

    const customerB = {
      customer_id: 'CUST_002',
      customer_name: '顧客B',
      phone_number: '09012345678',
      email: 'customerB@example.com',
      duplicate_score: 0,
    };

    const result = detectDuplicateCustomers([customerA, customerB]);

    expect(result.candidates).toHaveLength(1);
    expect(result.candidates[0]).toEqual({
      customer_id_1: 'CUST_001',
      customer_id_2: 'CUST_002',
      duplicate_score: 25,
      matching_fields: ['phone_number'],
    });
  });
});