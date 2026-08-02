import { validateProposalDataValueRange } from '../../src/logic/it-1-br-2-1-2-1';

describe('営業データ品質検証エンジン', () => {
  // SCEN-1013
  test('提案内容の金額が業務上の最大規模金額に達する場合に値域検証が成功する', () => {
    const proposal_data = {
      proposal_id: 'PROP-2024-001',
      customer_id: 'CUST-2024-001',
      proposal_amount: 999999999,
      proposal_date: '2024-01-15',
      product_category: 'enterprise_solution',
      status: 'submitted'
    };

    const validation_result = validateProposalDataValueRange(proposal_data);

    expect(validation_result.isValid).toBe(true);
    expect(validation_result.error_messages).toEqual([]);
    expect(validation_result.proposal_amount_validated).toBe(999999999);
  });
});