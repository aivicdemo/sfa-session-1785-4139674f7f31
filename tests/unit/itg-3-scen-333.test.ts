import { evaluateRecommendationAccuracy } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-333
  test('推奨精度検証機能 - 成功した商談の推奨ケースが101件の場合、精度計測に全件が含まれる', () => {
    const successfulDealIds = Array.from({ length: 101 }, (_, i) => `deal_${String(i + 1).padStart(3, '0')}`);

    const mockDeals = successfulDealIds.map((dealId, index) => ({
      deal_id: dealId,
      customer_id: `cust_${String(index + 1).padStart(3, '0')}`,
      industry: index % 3 === 0 ? 'manufacturing' : index % 3 === 1 ? 'finance' : 'retail',
      company_size: index % 2 === 0 ? 'large' : 'medium',
      outcome: 'won' as const,
      success_pattern_id: `pattern_${String((index % 10) + 1).padStart(2, '0')}`,
      created_at: new Date('2024-01-01T00:00:00Z'),
      evaluation_score: 85 + (index % 15),
    }));

    const similarPatternResults = successfulDealIds.map((dealId, index) => ({
      deal_id: dealId,
      match_score: 0.75 + (index % 25) * 0.01,
      pattern_id: `pattern_${String((index % 10) + 1).padStart(2, '0')}`,
    }));

    const mockRecommendationEngine = {
      findSimilarPatterns: jest.fn().mockResolvedValue(similarPatternResults),
      generateRecommendation: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const evaluationResult = evaluateRecommendationAccuracy({
      successful_deals: mockDeals,
      recommendation_engine: mockRecommendationEngine,
      evaluation_period_start: new Date('2024-01-01T00:00:00Z'),
      evaluation_period_end: new Date('2024-12-31T23:59:59Z'),
    });

    expect(evaluationResult.total_deals_evaluated).toBe(101);
    expect(evaluationResult.deals_included_in_assessment).toBe(101);
    expect(evaluationResult.accuracy_score).toBeGreaterThan(0);
    expect(evaluationResult.accuracy_score).toBeLessThanOrEqual(100);
    expect(evaluationResult.assessment_coverage_percentage).toBe(100);
    expect(mockRecommendationEngine.findSimilarPatterns).toHaveBeenCalled();
  });
});