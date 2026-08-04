import { evaluateProposalConstraintAlignment } from '../../src/logic/it-1-br-3-2-1-1';

describe('AIエージェント推奨内容の根拠表示機能', () => {
  // SCEN-1356
  test('顧客の予算上限が登録されていないとき照合処理がエラーになる', () => {
    const mockAIEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        approach: 'standard_proposal',
        confidence: 85,
      }),
      findSimilarPatterns: jest.fn().mockResolvedValue([]),
      explainRecommendationReasoning: jest.fn().mockResolvedValue(''),
      evaluatePatternRelevance: jest.fn().mockResolvedValue(0),
    };

    const customerWithoutBudget = {
      customer_id: 'CUST-001',
      customer_name: '株式会社テスト',
      industry: 'manufacturing',
      annual_revenue: 1000000000,
      budget_limit: null,
    };

    const dealCondition = {
      deal_id: 'DEAL-001',
      product_category: 'equipment',
      quantity: 5,
      delivery_deadline: '2024-06-30',
      estimated_amount: 5000000,
    };

    const proposalContent = {
      proposal_id: 'PROP-001',
      recommended_product: 'equipment_model_A',
      unit_price: 1000000,
      total_amount: 5000000,
      delivery_term: '60 days',
    };

    expect(() =>
      evaluateProposalConstraintAlignment(
        customerWithoutBudget,
        dealCondition,
        proposalContent,
        mockAIEngine
      )
    ).toThrow(/BUDGET_CONSTRAINT_MISSING/);
  });
});