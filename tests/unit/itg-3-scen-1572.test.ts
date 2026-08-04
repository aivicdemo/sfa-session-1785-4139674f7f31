import { visualizeRecommendationReasoning } from '../../src/logic/it-1-br-3-1-1-1';

describe('推奨根拠の可視化機能', () => {
  // SCEN-1572
  test('推奨根拠のスコアが100を超える値のとき、エラーが発生する', () => {
    const mockAIEngine = {
      evaluatePatternRelevance: jest.fn().mockReturnValue({
        relevanceScore: 105,
        matchedPatternId: 'pattern_001',
        applicabilityFactors: ['factor_a', 'factor_b'],
      }),
      explainRecommendationReasoning: jest.fn(),
    };

    const recommendationData = {
      recommendationId: 'rec_001',
      customerId: 'cust_001',
      patternId: 'pattern_001',
      relevanceScore: 105,
      pastCaseExamples: [
        {
          caseId: 'case_001',
          customerIndustry: 'IT',
          dealSize: 5000000,
          successFactors: ['factor_a', 'factor_b'],
        },
      ],
      successPatterns: [
        {
          patternName: 'Enterprise_Approach',
          applicableConditions: ['large_scale', 'digital_transformation'],
          adoptionRate: 0.78,
        },
      ],
      riskFactors: [
        {
          riskName: 'budget_constraint',
          severity: 'high',
          mitigation: 'phased_implementation',
        },
      ],
      nextActions: [
        {
          actionId: 'action_001',
          actionName: 'schedule_cxo_meeting',
          priority: 1,
        },
      ],
    };

    expect(() =>
      visualizeRecommendationReasoning(recommendationData, mockAIEngine)
    ).toThrow(/Relevance score must not exceed 100/);

    try {
      visualizeRecommendationReasoning(recommendationData, mockAIEngine);
    } catch (error: unknown) {
      const err = error as {
        name: string;
        message: string;
        code: string;
      };
      expect(err.name).toBe('ValidationError');
      expect(err.message).toContain('Relevance score must not exceed 100');
      expect(err.code).toBe('ERR_INVALID_SCORE_RANGE');
    }
  });
});