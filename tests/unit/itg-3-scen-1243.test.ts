import { evaluateProposalAppropriateness } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  test('SCEN-1243: 提案妥当性判定機能 - 顧客ニーズ適合度が閾値直上（70.1%）のときに承認判定される', () => {
    const mockAIEngine = {
      evaluatePatternRelevance: jest.fn().mockResolvedValue({
        relevanceScore: 70.1,
        matchedPatterns: ['pattern_001'],
      }),
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
    };

    const dealData = {
      dealId: 'deal_test_001',
      customerId: 'cust_001',
      industry: 'manufacturing',
      companySize: 'large',
      budget: 5000000,
      timeline: '2024-Q2',
      customerNeeds: ['cost_reduction', 'process_optimization'],
    };

    const thresholdPercentage = 70.0;

    const result = evaluateProposalAppropriateness(
      dealData,
      mockAIEngine,
      thresholdPercentage
    );

    expect(result.approvalStatus).toBe('APPROVED');
    expect(result.relevanceScore).toBe(70.1);
    expect(result.reasoningLog).toMatch(
      /適合度スコア: 70\.1% は閾値 70\.0% 以上のため承認/
    );
    expect(result.isApproved).toBe(true);
  });
});