import { visualizeRecommendationReasoning } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-2801: [error] 推奨根拠の可視化機能 - 根拠の信頼度スコアが0未満のとき、エラーを返す
  test('根拠の信頼度スコアが0未満の場合、ValidationErrorを返す', () => {
    const mockAIEngine = {
      evaluatePatternRelevance: jest.fn().mockReturnValue({
        relevanceScore: -0.5,
        isApplicable: true,
      }),
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
    };

    const recommendationData = {
      recommendationId: 'rec-001',
      customerId: 'cust-001',
      dealConditions: {
        industry: 'IT',
        companySize: 'large',
        budget: 5000000,
      },
      proposalApproach: {
        approach_id: 'approach-001',
        strategy: 'executive_engagement',
      },
      credibilityScore: -0.5,
      evidenceData: [
        {
          pastCaseId: 'case-001',
          similarity: 0.85,
          outcome: 'success',
        },
      ],
    };

    const result = visualizeRecommendationReasoning(
      recommendationData,
      mockAIEngine
    );

    expect(result).toHaveProperty('errorCode', 'INVALID_CREDIBILITY_SCORE');
    expect(result).toHaveProperty('errorType', 'ValidationError');
    expect(result.message).toMatch(/信頼度スコアは0以上である必要があります/);
    expect(result).toHaveProperty('visualizationStatus', 'halted');
  });
});