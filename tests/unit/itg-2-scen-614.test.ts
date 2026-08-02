import { judgeCustomerDuplication } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と統合判定', () => {
  // SCEN-614
  test('重複候補複数件の場合、各件ごとに独立して判定される', () => {
    const customer_a_1 = {
      customer_id: 'CUST_A_1',
      name: '山田太郎',
      address: '東京都渋谷区1-2-3',
      phone: '09012345678',
    };

    const customer_a_2 = {
      customer_id: 'CUST_A_2',
      name: '山田太郎',
      address: '東京都渋谷区1-2-3',
      phone: '09012345679',
    };

    const customer_a_3 = {
      customer_id: 'CUST_A_3',
      name: '山田太郎',
      address: '東京都渋谷区1-2-4',
      phone: '09012345678',
    };

    const duplicate_pair_1 = {
      source_customer_id: customer_a_1.customer_id,
      target_customer_id: customer_a_2.customer_id,
      source_customer: customer_a_1,
      target_customer: customer_a_2,
    };

    const duplicate_pair_2 = {
      source_customer_id: customer_a_1.customer_id,
      target_customer_id: customer_a_3.customer_id,
      source_customer: customer_a_1,
      target_customer: customer_a_3,
    };

    const duplicate_pair_3 = {
      source_customer_id: customer_a_2.customer_id,
      target_customer_id: customer_a_3.customer_id,
      source_customer: customer_a_2,
      target_customer: customer_a_3,
    };

    const result_1 = judgeCustomerDuplication(duplicate_pair_1);
    const result_2 = judgeCustomerDuplication(duplicate_pair_2);
    const result_3 = judgeCustomerDuplication(duplicate_pair_3);

    expect(result_1.similarity_score).toBe(85);
    expect(result_1.should_merge).toBe(true);
    expect(result_1.source_customer_id).toBe('CUST_A_1');
    expect(result_1.target_customer_id).toBe('CUST_A_2');

    expect(result_2.similarity_score).toBe(60);
    expect(result_2.should_merge).toBe(false);
    expect(result_2.source_customer_id).toBe('CUST_A_1');
    expect(result_2.target_customer_id).toBe('CUST_A_3');

    expect(result_3.similarity_score).toBe(72);
    expect(result_3.should_merge).toBe(true);
    expect(result_3.source_customer_id).toBe('CUST_A_2');
    expect(result_3.target_customer_id).toBe('CUST_A_3');

    expect(result_1.should_merge).not.toBe(result_2.should_merge);
    expect(result_3.similarity_score).toBeGreaterThan(result_2.similarity_score);
    expect(result_3.similarity_score).toBeLessThan(result_1.similarity_score);
  });
});