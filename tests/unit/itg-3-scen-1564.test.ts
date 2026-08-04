import { findSimilarPatterns } from '../../src/logic/it-1-br-3-3-2-1';

describe('類似顧客マッチング処理 - 提案内容の金額バリデーション', () => {
  test('SCEN-1564: 提案内容の金額が負の値のときエラーが発生する', () => {
    const customerData = {
      customerId: 'CUST-001',
      industry: 'IT',
      company_size: 'large',
      purchase_history: [
        {
          date: '2024-01-15',
          amount: 100000,
          product_category: 'software'
        }
      ]
    };

    const dealCondition = {
      dealId: 'DEAL-001',
      dealStage: 'proposal',
      customer_need: 'システム導入',
      timeline_months: 3
    };

    const proposalContent = {
      proposal_id: 'PROP-001',
      product_name: 'Enterprise Software Suite',
      amount: -50000,
      currency: 'JPY'
    };

    const input = {
      customer_data: customerData,
      deal_condition: dealCondition,
      proposal_content: proposalContent
    };

    expect(() => findSimilarPatterns(input)).toThrow(/金額/);
  });
});