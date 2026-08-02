import { judgeCustomerDuplication } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-217
  test('[normal] 統合判定の重複候補ペアが同順序で再実行されたとき、同じ判定結果が得られる', () => {
    const customer_a = {
      customer_id: 'CUST-001',
      customer_name: '山田太郎',
      email: 'yamada@example.com',
    };

    const customer_b = {
      customer_id: 'CUST-002',
      customer_name: '山田太郎',
      email: 'yamada.t@example.com',
    };

    const first_result = judgeCustomerDuplication(customer_a, customer_b);

    const second_result = judgeCustomerDuplication(customer_a, customer_b);

    expect(first_result.judgment_conclusion).toBe(second_result.judgment_conclusion);
    expect(first_result.reason_code).toBe(second_result.reason_code);
    expect(first_result.similarity_score).toBe(second_result.similarity_score);
    expect(first_result.field_differences).toEqual(second_result.field_differences);
  });
});