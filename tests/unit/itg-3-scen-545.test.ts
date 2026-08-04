import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import { decideSalesGuidancePolicy } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-545: [edge] 営業指導方針決定機能 - データ品質スコアが100のとき指導方針が正常維持になる
  test('should determine guidance policy as MAINTAIN when data quality score is 100', () => {
    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendationId: 'rec-001',
        approach: 'Standard Proposal Approach',
        confidenceScore: 95,
        reasoning: 'High data quality enables confident recommendation',
      }),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const dealInfo = {
      dealId: 'deal-545',
      customerId: 'cust-001',
      customerIndustry: 'Technology',
      customerSize: 'Enterprise',
      proposalAmount: 500000,
      dataQualityScore: 100,
      createdAt: new Date('2024-01-15T11:00:00Z'),
      proposalContent: 'Cloud Migration Solution',
      customerConstraints: {
        budgetLimit: 600000,
        implementationDeadline: '2024-06-30',
        technicalRequirements: ['Cloud-native', 'Scalable'],
      },
    };

    const result = decideSalesGuidancePolicy(dealInfo, mockAIRecommendationEngine);

    expect(result).toEqual({
      dealId: 'deal-545',
      guidelinePolicy: 'MAINTAIN',
      guidancePolicyDescription: '正常維持',
      dataQualityScore: 100,
      statusCode: 200,
      message: 'Guidance policy determined successfully',
      recommendedActions: [],
      policyReason: 'Data quality is optimal. No corrective action required.',
      lastUpdated: expect.any(String),
    });

    expect(result.statusCode).toBe(200);
    expect(result.guidelinePolicy).toBe('MAINTAIN');
    expect(result.guidancePolicyDescription).toBe('正常維持');
    expect(result.dataQualityScore).toBe(100);
  });
});