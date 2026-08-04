import { evaluateProposalViability } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-1403: [edge] 提案内容と顧客制約条件の自動照合機能 - 投資対効果の計算結果が0のとき、投資不適正と判定される
  test('should mark proposal as INVESTMENT_INAPPROPRIATE when ROI equals zero', () => {
    const proposalData = {
      proposalId: 'PROP-001',
      customerId: 'CUST-A001',
      proposalAmount: 1000000,
      implementationCost: 1000000,
      expectedBenefit: 0,
      implementationPeriodDays: 90,
    };

    const customerConstraints = {
      customerId: 'CUST-A001',
      budgetLimit: 1500000,
      maxImplementationDays: 120,
      minExpectedBenefit: 100000,
    };

    const aiEngineStub = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    aiEngineStub.generateRecommendation.mockResolvedValue({
      roi: 0,
      investmentViability: 'INVESTMENT_INAPPROPRIATE',
      rationale: '投資対効果がゼロであるため、財務的価値を生まない提案として不適正と判定',
    });

    const result = evaluateProposalViability(
      proposalData,
      customerConstraints,
      aiEngineStub
    );

    expect(result.viabilityStatus).toBe('INVESTMENT_INAPPROPRIATE');
    expect(result.isRecommendationExcluded).toBe(true);
    expect(result.roi).toBe(0);
    expect(result.rationale).toBe(
      '投資対効果がゼロであるため、財務的価値を生まない提案として不適正と判定'
    );
    expect(result.recommendedForProposal).toBe(false);
  });
});