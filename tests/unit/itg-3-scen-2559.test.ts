import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import { generateRecommendationWithReasoning } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-2559
  test('推奨生成日が月初のとき、根拠に記録される', () => {
    const fixed_now = new Date('2026-01-01T09:00:00Z');
    const fixed_timestamp = '2026-01-01T09:00:00Z';
    const fixed_date_string = '2026-01-01';

    const mockAIEngine = {
      generateRecommendation: jest.fn().mockReturnValue({
        recommendationId: 'rec-001',
        generatedAt: fixed_timestamp,
        proposalApproach: 'Initial consultation with budget alignment',
        confidenceScore: 85,
        relatedSuccessPatterns: [
          {
            patternId: 'pat-101',
            title: 'Early-stage prospect nurturing',
            matchScore: 0.92,
          },
        ],
      }),
      findSimilarPatterns: jest.fn().mockReturnValue([
        {
          patternId: 'pat-101',
          matchScore: 0.92,
          description: 'Similar case from Q1 2025',
        },
      ]),
      explainRecommendationReasoning: jest.fn().mockReturnValue(
        'Based on customer profile and budget tier, initial consultation with 3-month follow-up aligns with 92% of similar successful cases.'
      ),
      evaluatePatternRelevance: jest.fn().mockReturnValue(0.88),
    };

    const input_customer_info = {
      customerId: 'cust-2026-001',
      customerName: 'TechCorp Japan',
      industry: 'Information Technology',
      revenue: 5000000000,
      numberOfEmployees: 250,
      region: 'Tokyo',
    };

    const input_deal_context = {
      dealId: 'deal-2026-0101-001',
      productCategory: 'Enterprise Software Suite',
      estimatedBudget: 15000000,
      projectDuration: 180,
      decisionMakersCount: 3,
      currentPhase: 'initial_qualification',
    };

    const result = generateRecommendationWithReasoning(
      input_customer_info,
      input_deal_context,
      mockAIEngine
    );

    expect(result).toBeDefined();
    expect(result.recommendation).toBeDefined();
    expect(result.reasoning).toBeDefined();

    expect(result.recommendation.recommendationId).toBe('rec-001');
    expect(result.recommendation.generatedAt).toBe(fixed_timestamp);
    expect(result.recommendation.proposalApproach).toBe(
      'Initial consultation with budget alignment'
    );
    expect(result.recommendation.confidenceScore).toBe(85);

    expect(result.reasoning).toBeDefined();
    expect(result.reasoning.generatedDate).toBe(fixed_date_string);
    expect(result.reasoning.timestamp).toBe(fixed_timestamp);

    expect(result.reasoning.visibilityDisplay).toBeDefined();
    expect(result.reasoning.visibilityDisplay.displayDate).toBe(fixed_date_string);
    expect(result.reasoning.visibilityDisplay.displayDateTime).toBe(fixed_timestamp);

    expect(mockAIEngine.generateRecommendation).toHaveBeenCalledWith(
      input_customer_info,
      input_deal_context
    );

    expect(result.reasoning.similarPatterns).toBeDefined();
    expect(Array.isArray(result.reasoning.similarPatterns)).toBe(true);
    expect(result.reasoning.similarPatterns.length).toBeGreaterThan(0);

    expect(result.reasoning.explanation).toBeDefined();
    expect(typeof result.reasoning.explanation).toBe('string');
    expect(result.reasoning.explanation.length).toBeGreaterThan(0);

    const expected_month_start_pattern = /^2026-01-01/;
    expect(result.reasoning.generatedDate).toMatch(expected_month_start_pattern);
  });
});