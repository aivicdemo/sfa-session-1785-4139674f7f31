import { evaluateProposalFeasibility } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-1182
  test('[normal] 提案妥当性判定機能 - 顧客ニーズに適合しリスク要因が低リスクレベルの場合に承認判定される', () => {
    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        needsAlignmentScore: 0.85,
        riskLevel: '低',
        proposalContent: '業務効率化を実現するためのシステム導入提案',
      }),
      findSimilarPatterns: jest.fn().mockResolvedValue([]),
      explainRecommendationReasoning: jest.fn().mockResolvedValue(''),
      evaluatePatternRelevance: jest.fn().mockResolvedValue({
        relevanceScore: 0.8,
      }),
    };

    const proposalInput = {
      customerChallenge: '業務効率化',
      budget: 5000000,
      implementationDeadline: 90,
      riskAssessment: '低リスク',
      customerId: 'CUST001',
      dealId: 'DEAL001',
    };

    const timestamp = new Date('2024-01-15T11:00:00Z');

    const result = evaluateProposalFeasibility(
      proposalInput,
      mockAIRecommendationEngine,
      timestamp
    );

    expect(result.status).toBe('承認');
    expect(result.approvalReason).toContain('顧客ニーズとの適合度が高く');
    expect(result.approvalReason).toContain('0.85');
    expect(result.approvalReason).toContain('リスク要因が低リスクレベル');
    expect(result.proposalContent).toBe('業務効率化を実現するためのシステム導入提案');
    expect(result.evaluationTimestamp).toEqual(new Date('2024-01-15T11:00:00Z'));
    expect(mockAIRecommendationEngine.generateRecommendation).toHaveBeenCalledWith(
      proposalInput
    );
  });
});