import { evaluatePatternRelevance } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  test('SCEN-2079: 提案内容と顧客対応パターンの標準プロセス照合分析 - 乖離スコア50で中程度の乖離と判定', () => {
    // Arrange
    const proposalContent = {
      proposalId: 'PROP-20240115-001',
      customerId: 'CUST-12345',
      productCategory: 'Enterprise Software',
      proposalAmount: 500000,
      proposalDate: '2024-01-15T10:30:00Z',
      targetApproach: 'Direct negotiation with executive sponsors',
      proposalRationale: 'High-value deal requiring executive alignment'
    };

    const customerInteractionPattern = {
      interactionId: 'INT-001',
      lastContactDate: '2024-01-10T14:00:00Z',
      contactFrequencyDays: 7,
      responseTimeHours: 24,
      engagementLevel: 'High',
      decisionMakerEngagementStatus: 'Partial'
    };

    const standardProcessTemplate = {
      processId: 'STD-PROC-001',
      expectedApproach: 'Multi-stakeholder engagement with phased follow-up',
      expectedContactFrequency: 5,
      expectedResponseTime: 48,
      successCriteria: {
        minimumEngagementScore: 0.7,
        recommendedFollowUpTiming: 'Within 3 business days'
      }
    };

    // Mock AIRecommendationEngine stub
    const mockAIEngine = {
      evaluatePatternRelevance: jest.fn().mockReturnValue(50)
    };

    // Act
    const divergenceLevel = evaluatePatternRelevance(
      proposalContent,
      customerInteractionPattern,
      standardProcessTemplate,
      mockAIEngine
    );

    // Assert
    expect(divergenceLevel).toBe('MEDIUM_DIVERGENCE');
  });
});