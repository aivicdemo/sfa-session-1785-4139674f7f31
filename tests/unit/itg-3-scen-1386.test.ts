import { evaluateProposalFeasibility } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-1386
  test('提案内容と顧客制約条件の自動照合機能 - 顧客の予算制約がちょうど提案金額と等しいとき、実装可能性が100%と判定される', () => {
    const customerConstraints = {
      budgetLimit: 5000000,
      industry: 'manufacturing',
      company_size: 'large',
    };

    const proposalContent = {
      proposalName: 'System A Implementation',
      proposalAmount: 5000000,
      description: 'Enterprise system deployment',
    };

    const result = evaluateProposalFeasibility(
      customerConstraints,
      proposalContent
    );

    expect(result.feasibilityScore).toBe(100);
    expect(result.status).toBe('FEASIBLE');
    expect(result.matchRatio).toBe(1.0);
    expect(result.reason).toMatch(/予算/);
  });
});