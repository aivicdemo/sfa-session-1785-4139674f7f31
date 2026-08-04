import { evaluateProposalCustomerAlignment } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-1326
  test('[normal] 提案内容と顧客制約条件の自動照合機能 - 経営目標の適合度スコアが100%のとき、最大の目標適合値が返される', () => {
    const mockAIRecommendationEngine = {
      evaluatePatternRelevance: jest.fn().mockResolvedValue({
        score: 100,
        matchPercentage: 1.0,
        patternId: 'pattern-001',
        reasonText: '経営目標と完全に適合しています'
      })
    };

    const proposalContent = {
      productName: 'クラウドERPシステム',
      serviceSpecification: 'SaaS型、API連携対応',
      deliveryPeriod: 90,
      price: 5000000,
      implementationScope: 'フル機能実装'
    };

    const customerConstraints = {
      businessGoal: '業務効率化による営業生産性50%向上',
      budgetLimit: 6000000,
      implementationPeriod: 120,
      industry: '製造業',
      companySize: '従業員1000名以上',
      requiredCompliance: ['ISO27001', 'FISC']
    };

    const result = await evaluateProposalCustomerAlignment(
      proposalContent,
      customerConstraints,
      mockAIRecommendationEngine
    );

    expect(result.goalAlignmentScore).toBe(100);
    expect(typeof result.goalAlignmentScore).toBe('number');
    expect(result.goalAlignmentScore).not.toBeNull();
    expect(result.goalAlignmentScore).not.toBeUndefined();
    expect(result.patternId).toBe('pattern-001');
    expect(result.reasoningBasis).toBe('経営目標と完全に適合しています');
    expect(mockAIRecommendationEngine.evaluatePatternRelevance).toHaveBeenCalledTimes(1);
    expect(mockAIRecommendationEngine.evaluatePatternRelevance).toHaveBeenCalledWith(
      expect.objectContaining({
        proposalContent,
        customerConstraints
      })
    );
  });
});