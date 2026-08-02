import { detectDuplicatesAndInconsistencies } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-407
  test('複数件の不整合が全件報告される', () => {
    const customer_a = {
      customer_id: 'CUST_001',
      name: '田中太郎',
      phone: '090-1111-1111',
      address: '東京都渋谷区'
    };

    const customer_b = {
      customer_id: 'CUST_002',
      name: '田中太郎',
      phone: '090-1111-1111',
      address: '東京都渋谷区道玄坂'
    };

    const customer_c = {
      customer_id: 'CUST_003',
      name: '田中太郎',
      phone: '090-2222-2222',
      address: '東京都渋谷区'
    };

    const customers = [customer_a, customer_b, customer_c];

    const result = detectDuplicatesAndInconsistencies(customers);

    expect(result.inconsistencies).toHaveLength(3);

    const inconsistency_ab_address = result.inconsistencies.find(
      (inc) =>
        (inc.customer_id_1 === 'CUST_001' && inc.customer_id_2 === 'CUST_002') ||
        (inc.customer_id_1 === 'CUST_002' && inc.customer_id_2 === 'CUST_001')
    );
    expect(inconsistency_ab_address).toBeDefined();
    expect(inconsistency_ab_address?.field_name).toBe('address');
    expect(inconsistency_ab_address?.value_1).toBe('東京都渋谷区');
    expect(inconsistency_ab_address?.value_2).toBe('東京都渋谷区道玄坂');

    const inconsistency_ac_phone = result.inconsistencies.find(
      (inc) =>
        (inc.customer_id_1 === 'CUST_001' && inc.customer_id_2 === 'CUST_003') ||
        (inc.customer_id_1 === 'CUST_003' && inc.customer_id_2 === 'CUST_001')
    );
    expect(inconsistency_ac_phone).toBeDefined();
    expect(inconsistency_ac_phone?.field_name).toBe('phone');
    expect(inconsistency_ac_phone?.value_1).toBe('090-1111-1111');
    expect(inconsistency_ac_phone?.value_2).toBe('090-2222-2222');

    const inconsistency_bc_phone = result.inconsistencies.find(
      (inc) =>
        (inc.customer_id_1 === 'CUST_002' && inc.customer_id_2 === 'CUST_003') ||
        (inc.customer_id_1 === 'CUST_003' && inc.customer_id_2 === 'CUST_002')
    );
    expect(inconsistency_bc_phone).toBeDefined();
    expect(inconsistency_bc_phone?.field_name).toBe('phone');
    expect(inconsistency_bc_phone?.value_1).toBe('090-1111-1111');
    expect(inconsistency_bc_phone?.value_2).toBe('090-2222-2222');
  });
});