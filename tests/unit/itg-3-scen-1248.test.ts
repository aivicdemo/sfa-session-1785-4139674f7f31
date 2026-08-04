import { evaluateProposalViability } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-1248
  test('リスク要因スコアが上限直下（4.9）のときに承認判定される', () => {
    const mockAIEngine = {
      evaluatePatternRelevance: jest.fn().mockResolvedValue({
        relevanceScore: 85,
        riskFactorScore: 4.9,
        reasoning: 'Pattern matches with minor risk factors',
      }),
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
    };

    const proposalData = {
      customerId: 'CUST-001',
      customerIndustry: 'manufacturing',
      dealValue: 1500000,
      proposedApproach: 'efficiency_improvement',
      proposedProducts: ['product_a', 'product_b'],
      timelineMonths: 6,
      budgetConstraint: 2000000,
      scheduleConstraint: '2024-09-30',
    };

    const result = evaluateProposalViability(proposalData, mockAIEngine);

    expect(result.approval).toBe(true);
    expect(result.judgmentStatus).toBe('APPROVED');
    expect(result.riskFactorScore).toBe(4.9);
    expect(result.thresholdLimit).toBe(5.0);
    expect(mockAIEngine.evaluatePatternRelevance).toHaveBeenCalledWith(
      expect.objectContaining({
        customerId: 'CUST-001',
        proposedApproach: 'efficiency_improvement',
      })
    );
  });
});