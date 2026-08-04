import { analyzeProposalPatternAlignment } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-2082
  test('提案内容と顧客対応パターンの標準プロセス照合分析 - 成功パターン合致スコアがちょうど 75 のとき、高度な合致と判定される', () => {
    const mockAIEngine = {
      evaluatePatternRelevance: jest.fn().mockResolvedValue({
        matchScore: 75.0,
        relevanceLevel: 'HIGH_MATCH',
      }),
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
    };

    const proposalInput = {
      customerId: 'CUST-001',
      dealId: 'DEAL-12345',
      proposalContent: {
        productCategory: 'Enterprise_Software',
        proposedValue: 2500000,
        implementationTimeline: 90,
      },
      customerResponsePattern: {
        contactFrequency: 'weekly',
        decisionMakerEngagement: 'CFO_present',
        objectionType: 'budget_constraint',
      },
      dealCondition: {
        customerIndustry: 'Finance',
        customerScale: 'Large',
        dealStage: 'negotiation',
      },
    };

    const result = analyzeProposalPatternAlignment(
      proposalInput,
      mockAIEngine
    );

    expect(mockAIEngine.evaluatePatternRelevance).toHaveBeenCalledWith(
      proposalInput.dealCondition
    );

    expect(result.matchScore).toBe(75.0);
    expect(result.judgmentLevel).toBe('High Match');
    expect(result.recommendationDegree).toBe('Recommended');
    expect(result.applicabilityReasoning).toMatch(/成功パターン|合致|適用可能/);
    expect(typeof result.applicabilityReasoning).toBe('string');
    expect(result.applicabilityReasoning.length).toBeGreaterThan(0);
  });
});