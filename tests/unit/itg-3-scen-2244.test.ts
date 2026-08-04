import { evaluatePatternRelevance } from '../../src/logic/it-1-br-3-3-2-1';

describe('提案アプローチ適用可能性判定機能', () => {
  // SCEN-2244
  test('適用可能性スコアが0.5（部分的に適用可能）と判定される', async () => {
    const deal_condition = {
      customer_industry: '製造業',
      budget_scale: '中規模',
      implementation_period: '3ヶ月以内',
      issue_domain: '業務効率化'
    };

    const mock_ai_engine = {
      evaluatePatternRelevance: jest.fn().mockResolvedValue(0.5)
    };

    const result = await evaluatePatternRelevance(deal_condition, mock_ai_engine);

    expect(result.score).toBe(0.5);
    expect(result.applicability_level).toBe('PARTIAL');
    expect(result.adaptation_required).toBe(true);
    expect(result.rationale).toMatch(/一致度が50%|カスタマイズが必要|部分的に適用可能/);
  });
});