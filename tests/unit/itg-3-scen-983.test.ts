import { extractAndRecommendSuccessPatterns } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン抽出・照合機能', () => {
  // SCEN-983
  test('AIRecommendationEngine の evaluatePatternRelevance が API エラーを返すとき、関連度スコア 0 で代替処理される', async () => {
    const mockEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        approach: 'standard_proposal',
        reasoning: 'Based on customer profile',
      }),
      findSimilarPatterns: jest.fn().mockResolvedValue([
        {
          patternId: 'PAT-001',
          industry: 'IT',
          companySize: 'large',
          successRate: 0.85,
        },
        {
          patternId: 'PAT-002',
          industry: 'IT',
          companySize: 'large',
          successRate: 0.78,
        },
      ]),
      evaluatePatternRelevance: jest
        .fn()
        .mockRejectedValueOnce(new Error('429 Rate Limit'))
        .mockRejectedValueOnce(new Error('429 Rate Limit'))
        .mockRejectedValueOnce(new Error('500 Internal Server Error')),
      explainRecommendationReasoning: jest.fn().mockResolvedValue({
        summary: 'Based on historical success patterns',
      }),
    };

    const successPatternMaster = [
      {
        patternId: 'PAT-MASTER-001',
        approach: 'consultative_selling',
        successRate: 0.92,
        rank: 1,
      },
      {
        patternId: 'PAT-MASTER-002',
        approach: 'solution_based',
        successRate: 0.88,
        rank: 2,
      },
    ];

    const dealCondition = {
      customerId: 'CUST-12345',
      industry: 'IT',
      companySize: 'large',
      budget: 500000,
      timeline: 'Q2-2024',
    };

    const result = await extractAndRecommendSuccessPatterns(
      dealCondition,
      mockEngine,
      successPatternMaster
    );

    expect(result).toEqual({
      relevanceScore: 0,
      recommendedPattern: {
        patternId: 'PAT-MASTER-001',
        approach: 'consultative_selling',
        successRate: 0.92,
      },
      reasoning: 'Based on historical success patterns',
      isAlternative: true,
      retryAttempts: 3,
    });

    expect(mockEngine.evaluatePatternRelevance).toHaveBeenCalledTimes(3);
  });
});