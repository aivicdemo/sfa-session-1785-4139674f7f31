import { calculateProposalNeedsCompatibility } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-718
  test('提案資料と顧客ニーズの適合度スコア化機能 - 顧客予算制約が提案金額以下で、予算適合スコアが最低値になる', () => {
    const customer_budget_constraint = 500000;
    const proposal_amount = 500000;

    const input = {
      customer_id: 'CUST-001',
      customer_budget_constraint,
      proposal_amount,
      industry: 'manufacturing',
      company_scale: 'large',
      proposal_category: 'system_integration',
      proposal_details: {
        product_name: 'Enterprise ERP System',
        implementation_period_months: 6,
        training_included: true,
      },
    };

    const result = calculateProposalNeedsCompatibility(input);

    expect(result).toHaveProperty('budget_compatibility_score');
    expect(result.budget_compatibility_score).toBe(0);
  });
});