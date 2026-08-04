import { evaluateProposalValidity } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-1249
  test('リスク要因スコアが上限直上のときに却下判定が出力される', () => {
    const dealCondition = {
      customerId: 'CUST-001',
      dealId: 'DEAL-001',
      industry: 'Manufacturing',
      companySize: 'Large',
      budget: 5000000,
      timeline: '2024-Q2',
      riskFactorScore: 5.1,
      successPatternId: 'PATTERN-001',
      proposalContent: 'Advanced automation solution',
      customerConstraints: {
        maxBudget: 5000000,
        requiredDeliveryDate: '2024-06-30',
        allowedProductCategories: ['Automation', 'Software']
      }
    };

    const result = evaluateProposalValidity(dealCondition);

    expect(result.judgement).toBe('REJECTED');
    expect(result.riskScore).toBe(5.1);
    expect(result.riskThreshold).toBe(5.0);
    expect(result.reason).toMatch(/リスク要因スコア/);
    expect(result.reason).toMatch(/5\.1/);
    expect(result.reason).toMatch(/上限閾値/);
    expect(result.reason).toMatch(/5\.0/);
    expect(result.reason).toMatch(/超過/);
  });
});