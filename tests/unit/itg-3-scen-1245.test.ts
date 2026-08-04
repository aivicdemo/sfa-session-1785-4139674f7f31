import { evaluateProposalAppropriateness } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェント推奨根拠の可視化機能', () => {
  test('SCEN-1245: 営業プロセス遵守度が閾値直下（79.9%）のときに改善指摘が出力される', () => {
    // Arrange
    const mockAIRecommendationEngine = {
      evaluatePatternRelevance: jest.fn().mockReturnValue(0.799),
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
    };

    const proposalData = {
      proposalId: 'PROP-20240115-001',
      customerId: 'CUST-12345',
      proposalContent: 'Enterprise software implementation',
      customerConstraints: {
        budgetLimit: 5000000,
        implementationDeadline: '2024-03-31',
        requiredFeatures: ['reporting', 'integration', 'security'],
      },
      businessProcessComplianceScore: 0.799,
      riskFactors: [],
      proposalApproach: 'standard',
    };

    const complianceThreshold = 0.8;

    // Act
    const result = evaluateProposalAppropriateness(
      proposalData,
      mockAIRecommendationEngine,
      complianceThreshold
    );

    // Assert
    expect(result.isApproved).toBe(false);
    expect(result.improvementRequired).toBe(true);
    expect(result.complianceScore).toBe(0.799);
    expect(result.threshold).toBe(0.8);
    expect(result.improvementMessage).toMatch(/営業プロセス遵守度が目標値/);
    expect(result.improvementMessage).toMatch(/80\.0%/);
    expect(result.improvementMessage).toMatch(/以下の項目の改善を推奨します/);

    expect(result.improvementItems).toBeDefined();
    expect(Array.isArray(result.improvementItems)).toBe(true);
    expect(result.improvementItems.length).toBeGreaterThan(0);

    const improvementItemNames = result.improvementItems.map(
      (item: { name: string }) => item.name
    );
    expect(improvementItemNames).toEqual(
      expect.arrayContaining([
        expect.stringMatching(/ヒアリング/),
        expect.stringMatching(/商談記録/),
      ])
    );

    expect(result.expectedImprovementEffect).toBeDefined();
    expect(typeof result.expectedImprovementEffect).toBe('number');
    expect(result.expectedImprovementEffect).toBeGreaterThan(0);
    expect(result.expectedImprovementEffect).toBeLessThanOrEqual(100);

    expect(mockAIRecommendationEngine.evaluatePatternRelevance).toHaveBeenCalledWith(
      expect.objectContaining({
        proposalApproach: 'standard',
        complianceScore: 0.799,
      })
    );
  });
});