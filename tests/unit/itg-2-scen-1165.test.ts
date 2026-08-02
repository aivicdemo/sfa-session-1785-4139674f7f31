import { detectDuplicateCustomers } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  test('SCEN-1165: 同一電話番号・異なる顧客コードの2件データから重複候補を検出', () => {
    const input_customer_1 = {
      customer_code: 'CUST001',
      phone_number: '090-1234-5678',
      customer_name: '顧客A',
      email: 'a@example.com',
    };

    const input_customer_2 = {
      customer_code: 'CUST002',
      phone_number: '090-1234-5678',
      customer_name: '顧客B',
      email: 'b@example.com',
    };

    const input_customers = [input_customer_1, input_customer_2];

    const result = detectDuplicateCustomers(input_customers);

    expect(result).toEqual({
      duplicate_candidates: [
        {
          customer_code_1: 'CUST001',
          customer_code_2: 'CUST002',
          duplicate_type: '同一電話番号',
          phone_number: '090-1234-5678',
          detection_count: 1,
        },
      ],
      total_duplicate_count: 1,
    });
  });
});