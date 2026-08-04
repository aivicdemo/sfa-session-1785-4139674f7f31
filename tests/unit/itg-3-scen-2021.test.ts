import { generateExecutivePersuasionMaterial } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェント推奨支援システム - 経営層向け説得資料の自動生成機能', () => {
  // SCEN-2021
  test('改善提案が1件のとき、その1件が改善提案列に記載される', () => {
    // Arrange
    const improvementProposal = {
      proposalId: 'PROP-001',
      status: 'pending',
      content: '経営層向け説得資料の自動生成',
    };

    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        improvementProposals: [improvementProposal],
        confidenceScore: 85,
        rationale: 'Based on customer needs analysis',
      }),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const customerConstraints = {
      managementGoal: 'Cost reduction',
      budget: 1000000,
      scheduleConstraint: '2024-12-31',
    };

    const proposalContent = {
      title: 'Cost Optimization Solution',
      value: 500000,
      timeline: '6 months',
    };

    // Act
    const result = generateExecutivePersuasionMaterial(
      {
        customerConstraints,
        proposalContent,
      },
      mockAIRecommendationEngine,
    );

    // Assert
    expect(result.improvementProposals).toHaveLength(1);
    expect(result.improvementProposals[0].proposalId).toBe('PROP-001');
    expect(result.improvementProposals[0].status).toBe('pending');
    expect(result.improvementProposals[0].content).toBe('経営層向け説得資料の自動生成');
  });
});