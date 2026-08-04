import { evaluateProposalAppropriateness } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  test('SCEN-1244: 営業プロセス遵守度がちょうど閾値（80%）のときに承認判定される', () => {
    const mockAIEngine = {
      evaluatePatternRelevance: jest.fn().mockResolvedValue(0.8),
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
    };

    const proposalData = {
      proposalId: 'PROP-001',
      customerId: 'CUST-001',
      proposalContent: 'クラウド移行コンサルティング',
      processComplianceRate: 0.8,
      customerConstraints: {
        budgetLimit: 5000000,
        scheduleDeadline: '2024-12-31',
        allowedCategories: ['クラウドサービス', 'コンサルティング'],
      },
      proposalScore: 0.8,
      riskFactors: [],
    };

    const result = evaluateProposalAppropriateness(
      proposalData,
      mockAIEngine,
    );

    expect(result.approvalStatus).toBe('APPROVED');
    expect(result.judgmentReason).toContain('営業プロセス遵守度が基準値80%に達しています');
    expect(typeof result.complianceScore).toBe('number');
    expect(result.complianceScore).toBe(0.8);
  });
});