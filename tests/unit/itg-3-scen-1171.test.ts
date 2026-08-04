import { evaluateCustomerConstraintMatch } from '../../src/logic/it-1-br-3-3-2-1';

describe('顧客制約条件との照合機能', () => {
  // SCEN-1171
  test('提案の合計金額が顧客の購入上限直下のとき、適用可能と判定する', () => {
    const customer_id = 'CUST-001';
    const purchase_limit_amount = 100000;
    const proposal_total_amount = 100000;

    const result = evaluateCustomerConstraintMatch({
      customer_id,
      purchase_limit_amount,
      proposal_total_amount,
    });

    expect(result).toEqual({
      is_applicable: true,
      judgment_reason: 'within_limit',
      total_amount: 100000,
      limit_amount: 100000,
    });
  });
});