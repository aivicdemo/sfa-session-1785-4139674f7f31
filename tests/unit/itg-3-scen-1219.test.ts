import { evaluateProposalValidity } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-1219
  test('提案と顧客ニーズが業務ルール上矛盾する場合、妥当性判定エラーを返す', () => {
    const customer_needs = {
      industry: '製造業',
      challenge: 'コスト削減',
      budget_max: 5000000,
      desired_timeline: 'immediate',
    };

    const proposal = {
      solution_name: '高級カスタマイズソリューション',
      required_budget: 20000000,
      implementation_duration_months: 12,
    };

    const business_rules = [
      {
        rule_id: 'BUDGET_CONTRADICTION',
        rule_name: '予算規則',
        description: '予算が顧客提示額の半分未満の提案は矛盾',
        condition: (proposal_budget: number, customer_budget: number) =>
          proposal_budget < customer_budget / 2,
      },
      {
        rule_id: 'TIMELINE_CONTRADICTION',
        rule_name: 'タイムライン規則',
        description: '導入期間が3ヶ月以上で即座導入要望は矛盾',
        condition: (duration: number, timeline: string) =>
          duration >= 3 && timeline === 'immediate',
      },
    ];

    const mock_ai_engine = {
      generateRecommendation: jest.fn().mockReturnValue({
        solution_name: proposal.solution_name,
        required_budget: proposal.required_budget,
        implementation_duration_months: proposal.implementation_duration_months,
      }),
    };

    const result = evaluateProposalValidity(
      customer_needs,
      proposal,
      business_rules,
      mock_ai_engine
    );

    expect(result.response_type).toBe('error');
    expect(result.validity_score).toBe(0);
    expect(result.validity_status).toBe('NOT_VALID');
    expect(result.error_code).toMatch(/PROPOSAL_RULE_CONFLICT|VALIDATION_FAILED/);
    expect(result.error_message).toMatch(/矛盾/);

    expect(result.violations).toBeDefined();
    expect(result.violations.length).toBeGreaterThan(0);

    const budget_violation = result.violations.find(
      (v: any) => v.violated_rule_id === 'BUDGET_CONTRADICTION'
    );
    expect(budget_violation).toBeDefined();
    expect(budget_violation.violated_rule_name).toBe('予算規則');
    expect(budget_violation.detail).toMatch(/2000万円|20000000/);
    expect(budget_violation.detail).toMatch(/500万円|5000000/);

    const timeline_violation = result.violations.find(
      (v: any) => v.violated_rule_id === 'TIMELINE_CONTRADICTION'
    );
    expect(timeline_violation).toBeDefined();
    expect(timeline_violation.violated_rule_name).toBe('タイムライン規則');
    expect(timeline_violation.detail).toMatch(/12ヶ月|12 months/);
    expect(timeline_violation.detail).toMatch(/即座/);
  });
});