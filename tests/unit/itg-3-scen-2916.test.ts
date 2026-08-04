import { generateRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('IT-1-BR-3-3-2-1: AIRecommendationEngine generateRecommendation with invalid response format', () => {
  // SCEN-2916
  test('should handle invalid API response format and return fallback recommendation with validation error logged', async () => {
    const customerId = 'CUST-001';
    const dealStage = 'initial_contact';
    const budget = 5000000;
    const industry = 'technology';
    const companySize = 'large';

    const invalidResponses = [null, {}, 'invalid_string', 12345, []];

    for (const invalidResponse of invalidResponses) {
      const mockAIEngine = {
        generateRecommendation: jest.fn().mockResolvedValue(invalidResponse),
        findSimilarPatterns: jest.fn(),
        explainRecommendationReasoning: jest.fn(),
        evaluatePatternRelevance: jest.fn(),
      };

      const mockPatternMaster = [
        {
          patternId: 'PAT-TOP-001',
          successRate: 0.87,
          recommendationContent: 'Executive engagement strategy with ROI analysis',
          proposalApproach: 'C-level presentation with 3-month pilot',
          rankingScore: 95,
        },
        {
          patternId: 'PAT-TOP-002',
          successRate: 0.82,
          recommendationContent: 'Budget-focused value proposition',
          proposalApproach: 'Cost-benefit analysis with phased implementation',
          rankingScore: 88,
        },
      ];

      const mockErrorLogger = {
        recordValidationError: jest.fn(),
      };

      const result = await generateRecommendation(
        {
          customerId,
          dealStage,
          budget,
          industry,
          companySize,
        },
        mockAIEngine,
        mockPatternMaster,
        mockErrorLogger
      );

      expect(mockErrorLogger.recordValidationError).toHaveBeenCalled();
      expect(mockErrorLogger.recordValidationError).toHaveBeenCalledWith(
        expect.objectContaining({
          errorType: 'INVALID_API_RESPONSE_FORMAT',
          invalidValue: invalidResponse,
        })
      );

      expect(result).toEqual({
        status: 'fallback_applied',
        userMessage: '推奨の生成に一時的な遅延が発生しています。過去の推奨履歴から類似案件を表示します',
        recommendation: {
          patternId: 'PAT-TOP-001',
          recommendationContent: 'Executive engagement strategy with ROI analysis',
          proposalApproach: 'C-level presentation with 3-month pilot',
          rankingScore: 95,
          successRate: 0.87,
          isFallback: true,
        },
      });

      expect(result.recommendation).toBeDefined();
      expect(typeof result.recommendation.rankingScore).toBe('number');
      expect(result.recommendation.rankingScore).toBe(95);
      expect(result.recommendation.patternId).toBe('PAT-TOP-001');
      expect(result.userMessage).toBe('推奨の生成に一時的な遅延が発生しています。過去の推奨履歴から類似案件を表示します');
      expect(result.status).toBe('fallback_applied');
      expect(result.recommendation.isFallback).toBe(true);
    }
  });
});