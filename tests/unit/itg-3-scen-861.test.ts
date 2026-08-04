import { calculateRecommendationConfidenceScore } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  test('SCEN-861: [edge] 推奨信頼度スコア算出機能 - 信頼度スコアが閾値0ちょうどで算出される', () => {
    // Arrange
    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn().mockReturnValue(0.0),
    };

    const dealConditions = {
      customerId: 'CUST-20240115-001',
      dealId: 'DEAL-20240115-001',
      customerIndustry: 'IT',
      customerSize: 'Large',
      productCategory: 'Cloud Solution',
      dealStage: 'Proposal',
      proposalAmount: 50000000,
      confidenceThreshold: 0,
      createdAt: new Date('2024-01-15T11:00:00Z'),
    };

    // Act
    const result = calculateRecommendationConfidenceScore(
      dealConditions,
      mockAIRecommendationEngine
    );

    // Assert
    expect(result.confidenceScore).toBe(0.0);
    expect(result.recommendationJudgment).toBe('推奨不可');
    expect(result.confidenceScore).toBeLessThanOrEqual(dealConditions.confidenceThreshold);
  });
});