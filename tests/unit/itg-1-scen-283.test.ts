import { calculateProposalApproachMatchingScore } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-283
  test('成功パターンマトリクス参照による提案アプローチ判定機能 - 成功パターンの顧客規模が現在の顧客規模と異なる場合、マッチング度が低下される', () => {
    const success_patterns = [
      {
        pattern_id: 'SP001',
        customer_size: 'large_enterprise',
        product_category: 'enterprise_solution',
        proposal_type: 'strategic_proposal',
        contract_result: true,
        success_count: 5,
      },
      {
        pattern_id: 'SP002',
        customer_size: 'large_enterprise',
        product_category: 'integration_service',
        proposal_type: 'technical_proposal',
        contract_result: true,
        success_count: 3,
      },
      {
        pattern_id: 'SP003',
        customer_size: 'large_enterprise',
        product_category: 'consulting_service',
        proposal_type: 'business_proposal',
        contract_result: true,
        success_count: 4,
      },
    ];

    const current_customer = {
      customer_id: 'CUST001',
      customer_size: 'mid_size_enterprise',
      product_category: 'enterprise_solution',
      proposal_type: 'strategic_proposal',
    };

    const matching_score = calculateProposalApproachMatchingScore(
      success_patterns,
      current_customer,
    );

    expect(matching_score).toBeLessThanOrEqual(60);
    expect(matching_score).toBeGreaterThanOrEqual(0);
    expect(typeof matching_score).toBe('number');
  });
});