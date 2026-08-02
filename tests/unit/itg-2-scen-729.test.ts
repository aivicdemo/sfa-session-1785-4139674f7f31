import { describe, test, expect } from '@jest/globals';
import { evaluateProposalCustomerFitScore } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-729
  test('提案資料と顧客ニーズの適合度スコア化機能 - 不適合項目が0件のとき、不適合項目がないことが明示される', () => {
    const proposal_data = {
      industry: 'technology',
      company_size: 'large',
      annual_budget: 5000000,
      implementation_period: 6,
      required_features: ['feature_a', 'feature_b', 'feature_c'],
      support_level: 'premium',
      contract_term_months: 12
    };

    const customer_needs = {
      industry: 'technology',
      company_size: 'large',
      annual_budget: 5000000,
      implementation_period: 6,
      required_features: ['feature_a', 'feature_b', 'feature_c'],
      support_level: 'premium',
      contract_term_months: 12
    };

    const result = evaluateProposalCustomerFitScore(proposal_data, customer_needs);

    expect(result.mismatch_items).toEqual([]);
    expect(result.mismatch_items.length).toBe(0);
    expect(result.has_mismatch).toBe(false);
    expect(result.fit_score).toBe(100);
    expect(result.mismatch_message).toBe('');
  });
});