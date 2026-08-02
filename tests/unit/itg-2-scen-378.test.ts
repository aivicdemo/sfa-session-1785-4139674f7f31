import { detectDuplicateCustomers } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データ重複検出と統合判定機能', () => {
  // SCEN-378
  test('同一顧客名かつ同一電話番号の顧客が0件の場合、重複候補なしが返される', () => {
    const search_customer_name = '山田一郎';
    const search_phone_number = '080-1111-1111';

    const existing_customers = [
      {
        customer_id: 'C001',
        customer_name: '田中太郎',
        phone_number: '090-1234-5678'
      },
      {
        customer_id: 'C002',
        customer_name: '鈴木花子',
        phone_number: '090-9876-5432'
      },
      {
        customer_id: 'C003',
        customer_name: '佐藤次郎',
        phone_number: '090-5555-5555'
      }
    ];

    const result = detectDuplicateCustomers({
      search_customer_name,
      search_phone_number,
      existing_customers
    });

    expect(result.duplicate_candidates).toEqual([]);
    expect(result.duplicate_status).toBe('NO_DUPLICATE');
    expect(result.matched_count).toBe(0);
  });
});