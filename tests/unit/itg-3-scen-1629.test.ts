import { evaluatePatternRelevance } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-1629
  test('[normal] 推奨妥当性スコア算出機能 - 提案内容が複数件の場合、各提案ごとのスコアが独立して算出される', () => {
    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn()
        .mockResolvedValueOnce({ proposalId: 'proposal_1', relevanceScore: 0.87 })
        .mockResolvedValueOnce({ proposalId: 'proposal_2', relevanceScore: 0.62 })
        .mockResolvedValueOnce({ proposalId: 'proposal_3', relevanceScore: 0.91 })
    };

    const newDealData = {
      customerId: 'cust_001',
      customerIndustry: 'IT',
      customerScale: 'large',
      dealCondition: 'cloud_migration',
      dealValue: 5000000,
      dealTimeline: 90
    };

    const proposals = [
      {
        proposalId: 'proposal_1',
        proposalTitle: 'Cloud Infrastructure Modernization',
        proposalContent: 'Comprehensive cloud migration strategy',
        targetCustomerId: 'cust_001',
        successPatternId: 'pattern_cloud_001'
      },
      {
        proposalId: 'proposal_2',
        proposalTitle: 'Cost Optimization Review',
        proposalContent: 'Financial analysis and optimization',
        targetCustomerId: 'cust_001',
        successPatternId: 'pattern_cost_001'
      },
      {
        proposalId: 'proposal_3',
        proposalTitle: 'Digital Transformation Roadmap',
        proposalContent: 'Strategic transformation planning',
        targetCustomerId: 'cust_001',
        successPatternId: 'pattern_digital_001'
      }
    ];

    const results = proposals.map(proposal =>
      evaluatePatternRelevance(
        proposal,
        newDealData,
        mockAIRecommendationEngine
      )
    );

    expect(results).toHaveLength(3);
    expect(results[0].proposalId).toBe('proposal_1');
    expect(results[0].relevanceScore).toBe(0.87);
    expect(results[1].proposalId).toBe('proposal_2');
    expect(results[1].relevanceScore).toBe(0.62);
    expect(results[2].proposalId).toBe('proposal_3');
    expect(results[2].relevanceScore).toBe(0.91);

    expect(mockAIRecommendationEngine.evaluatePatternRelevance).toHaveBeenCalledTimes(3);
    expect(mockAIRecommendationEngine.evaluatePatternRelevance).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({ proposalId: 'proposal_1' }),
      expect.objectContaining({ customerId: 'cust_001' })
    );
    expect(mockAIRecommendationEngine.evaluatePatternRelevance).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({ proposalId: 'proposal_2' }),
      expect.objectContaining({ customerId: 'cust_001' })
    );
    expect(mockAIRecommendationEngine.evaluatePatternRelevance).toHaveBeenNthCalledWith(
      3,
      expect.objectContaining({ proposalId: 'proposal_3' }),
      expect.objectContaining({ customerId: 'cust_001' })
    );

    expect(results[0].relevanceScore).not.toBe(results[1].relevanceScore);
    expect(results[1].relevanceScore).not.toBe(results[2].relevanceScore);
    expect(results[0].relevanceScore).not.toBe(results[2].relevanceScore);
  });
});