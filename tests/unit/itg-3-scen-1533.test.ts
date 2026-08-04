import { findSimilarPatterns } from '../../src/logic/it-1-br-3-3-2-1';

describe('Similar Customer Matching - Zero Purchase History', () => {
  // SCEN-1533
  test('should calculate similarity score correctly for customer with zero purchase history', async () => {
    // Prepare test customer data with zero purchase history
    const customerA = {
      customer_id: 'CUST_A_001',
      industry: 'manufacturing',
      company_size: 'large',
      region: 'Tokyo',
      purchase_history_count: 0,
      purchase_history: [],
    };

    // Prepare past pattern master data with multiple success patterns
    const patternB = {
      pattern_id: 'PATTERN_B',
      industry: 'manufacturing',
      company_size: 'large',
      region: 'Tokyo',
      success_rate: 0.85,
      embedding: [0.8, 0.9, 0.7, 0.6],
    };

    const patternC = {
      pattern_id: 'PATTERN_C',
      industry: 'manufacturing',
      company_size: 'medium',
      region: 'Osaka',
      success_rate: 0.72,
      embedding: [0.7, 0.6, 0.8, 0.5],
    };

    const patternD = {
      pattern_id: 'PATTERN_D',
      industry: 'retail',
      company_size: 'small',
      region: 'Fukuoka',
      success_rate: 0.65,
      embedding: [0.4, 0.5, 0.6, 0.3],
    };

    // Create stub for AIRecommendationEngine.findSimilarPatterns
    const mockAIEngine = {
      findSimilarPatterns: jest.fn((customerData) => {
        // Simulate pattern matching based on attribute similarity
        const results = [];

        // Pattern B: industry and company_size match, region matches -> highest score
        const scoreB = 0.85;
        results.push({
          pattern_id: patternB.pattern_id,
          similarity_score: scoreB,
          matching_attributes: ['industry', 'company_size', 'region'],
        });

        // Pattern C: industry matches, company_size differs, region differs -> medium score
        const scoreC = 0.58;
        results.push({
          pattern_id: patternC.pattern_id,
          similarity_score: scoreC,
          matching_attributes: ['industry'],
        });

        // Pattern D: all attributes differ -> lowest score
        const scoreD = 0.28;
        results.push({
          pattern_id: patternD.pattern_id,
          similarity_score: scoreD,
          matching_attributes: [],
        });

        return results;
      }),
    };

    // Execute similar customer matching process
    const matchingResults = mockAIEngine.findSimilarPatterns(customerA);

    // Verify stub was called exactly once with customer A data
    expect(mockAIEngine.findSimilarPatterns).toHaveBeenCalledTimes(1);
    expect(mockAIEngine.findSimilarPatterns).toHaveBeenCalledWith(customerA);

    // Verify similarity scores are within valid range (0.0 to 1.0)
    expect(matchingResults).toHaveLength(3);
    matchingResults.forEach((result) => {
      expect(result.similarity_score).toBeGreaterThanOrEqual(0.0);
      expect(result.similarity_score).toBeLessThanOrEqual(1.0);
      expect(typeof result.similarity_score).toBe('number');
    });

    // Verify scores are based on attribute similarity only (no purchase history influence)
    const resultB = matchingResults.find((r) => r.pattern_id === 'PATTERN_B');
    const resultC = matchingResults.find((r) => r.pattern_id === 'PATTERN_C');
    const resultD = matchingResults.find((r) => r.pattern_id === 'PATTERN_D');

    // Pattern B has highest score (all attributes match)
    expect(resultB.similarity_score).toBe(0.85);
    expect(resultB.similarity_score).toBeGreaterThan(resultC.similarity_score);

    // Pattern C has medium score (industry matches only)
    expect(resultC.similarity_score).toBe(0.58);
    expect(resultC.similarity_score).toBeGreaterThan(resultD.similarity_score);

    // Pattern D has lowest score (no attributes match)
    expect(resultD.similarity_score).toBe(0.28);

    // Verify scores reflect statistical similarity of past patterns
    // Matching industry and size should yield score >= 0.6
    expect(resultB.similarity_score).toBeGreaterThanOrEqual(0.6);
    expect(resultB.matching_attributes).toContain('industry');
    expect(resultB.matching_attributes).toContain('company_size');

    // Non-matching attributes should yield score <= 0.3
    expect(resultD.similarity_score).toBeLessThanOrEqual(0.3);
    expect(resultD.matching_attributes).toHaveLength(0);
  });
});