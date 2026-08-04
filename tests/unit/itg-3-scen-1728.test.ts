import { evaluateRecommendationScore } from '../../src/logic/it-1-br-3-3-2-1';

describe('推奨妥当性スコア算出機能', () => {
  test('SCEN-1728: 推奨時期が年度をまたぐとき推奨スコアを正しく計算する', () => {
    // Setup: Mock AIRecommendationEngine
    const mockAIRecommendationEngine = {
      evaluatePatternRelevance: jest.fn(() => [
        { pattern_id: 'pattern_a', relevance_score: 0.85 },
        { pattern_id: 'pattern_b', relevance_score: 0.72 },
        { pattern_id: 'pattern_c', relevance_score: 0.68 }
      ]),
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn()
    };

    // Setup: Business conditions spanning fiscal year boundary
    // Fiscal year starts April 1, ends March 31
    // Recommended period: Feb 1 (current year) to Mar 31 (next year)
    const dealConditions = {
      customer_id: 'cust_001',
      customer_industry: '製造業',
      customer_scale: 'large',
      deal_value: 5000000,
      recommended_start_date: new Date('2024-02-01T00:00:00Z'),
      recommended_end_date: new Date('2025-03-31T23:59:59Z'),
      proposal_type: 'solution'
    };

    // Execute: Calculate recommendation score
    const result = evaluateRecommendationScore(dealConditions, mockAIRecommendationEngine);

    // Verify: Base score calculation
    // (0.85 + 0.72 + 0.68) / 3 = 2.25 / 3 = 0.75
    const expectedBaseScore = 0.75;

    // Verify: Period spanning fiscal year
    // Current fiscal year: Apr 1, 2024 - Mar 31, 2025
    // Recommended period: Feb 1, 2024 - Mar 31, 2025
    // Days in current fiscal year (Feb 1 - Mar 31, 2024): 60 days (Feb: 29, Mar: 31)
    // Wait - Feb 1 is before fiscal year start (Apr 1)
    // Re-calculate: Feb 1, 2024 to Mar 31, 2025
    // Feb 2024: 29 days (2024 is leap year, from Feb 1-29)
    // Mar 2024: 31 days
    // Apr 2024 - Mar 2025: 365 days (full fiscal year)
    // Total: 29 + 31 + 365 = 425 days
    // Days before Apr 1, 2025: 60 days (Feb + Mar 2024)
    // Days from Apr 1, 2024 - Mar 31, 2025: 365 days
    // Total: 60 + 365 = 425 days
    const totalDays = 425;
    const daysInCurrentFiscalYear = 60; // Feb 29 + Mar 31 before Apr 1, 2024
    const daysInNextFiscalYear = 365; // Full year Apr 1, 2024 - Mar 31, 2025

    // Verify: Confidence adjustment factor based on period length
    // Expected range: 0.99 - 1.01
    const adjustmentFactorMin = 0.99;
    const adjustmentFactorMax = 1.01;

    // Expected score range: 0.75 * 0.99 to 0.75 * 1.01 = 0.7425 to 0.7575
    const expectedScoreMin = 0.75 * adjustmentFactorMin;
    const expectedScoreMax = 0.75 * adjustmentFactorMax;

    // Assert: Score within expected range
    expect(result.recommendation_score).toBeGreaterThanOrEqual(expectedScoreMin);
    expect(result.recommendation_score).toBeLessThanOrEqual(expectedScoreMax);
    expect(result.recommendation_score).toBeGreaterThanOrEqual(0.75);
    expect(result.recommendation_score).toBeLessThanOrEqual(0.80);

    // Assert: Base score is 0.75
    expect(result.base_score).toBe(0.75);

    // Assert: Period calculation details
    expect(result.period_analysis).toEqual({
      total_days: 425,
      days_before_fiscal_year_start: 60,
      days_in_current_fiscal_year: 60,
      days_in_next_fiscal_year: 365,
      spans_fiscal_year: true
    });

    // Assert: Adjustment factor is within acceptable range
    expect(result.adjustment_factor).toBeGreaterThanOrEqual(0.99);
    expect(result.adjustment_factor).toBeLessThanOrEqual(1.01);

    // Assert: Log contains fiscal year boundary detection
    expect(result.audit_log).toMatch(/年度越境期間を検出/);
    expect(result.audit_log).toMatch(/当年度日数60日/);
    expect(result.audit_log).toMatch(/翌年度日数365日/);
    expect(result.audit_log).toMatch(/合計425日/);

    // Assert: Pattern relevance scores were evaluated
    expect(mockAIRecommendationEngine.evaluatePatternRelevance).toHaveBeenCalled();
  });
});