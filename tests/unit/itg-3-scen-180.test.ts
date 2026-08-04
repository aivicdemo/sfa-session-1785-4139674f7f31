import { extractSuccessPatterns } from '../../src/logic/it-1-br-3-3-2-1';

describe('Success Pattern Extraction with Deduplication', () => {
  // SCEN-180
  test('should deduplicate overlapping success patterns based on customer scale, industry, and approach', async () => {
    // Setup: Define test data with duplicate and unique patterns
    const patternA = {
      patternId: 'pattern-a',
      customerScale: 'large',
      industry: 'manufacturing',
      proposalApproach: 'implementation-support',
      matchScore: 0.95,
    };

    const patternB = {
      patternId: 'pattern-b',
      customerScale: 'large',
      industry: 'manufacturing',
      proposalApproach: 'implementation-support',
      matchScore: 0.92,
    };

    const patternC = {
      patternId: 'pattern-c',
      customerScale: 'mid-size',
      industry: 'distribution',
      proposalApproach: 'free-trial',
      matchScore: 0.78,
    };

    const similarPatterns = [patternA, patternB, patternC];

    // Stub AIRecommendationEngine.findSimilarPatterns
    const mockAiEngine = {
      findSimilarPatterns: jest.fn().mockResolvedValue(similarPatterns),
    };

    // Input: New deal conditions for filtering
    const newDealCondition = {
      customerScale: 'large',
      industry: 'manufacturing',
      budgetSize: '10000000',
    };

    // Execute: Call the function with stubbed engine
    const result = await extractSuccessPatterns(newDealCondition, mockAiEngine);

    // Verify: Check deduplication results
    expect(result.uniquePatterns).toHaveLength(2);
    expect(result.deduplicationCount).toBe(1);

    // Verify: Consolidated pattern A/B should have preserved metrics
    const consolidatedPattern = result.uniquePatterns.find(
      (p) =>
        p.customerScale === 'large' &&
        p.industry === 'manufacturing' &&
        p.proposalApproach === 'implementation-support'
    );
    expect(consolidatedPattern).toBeDefined();
    expect(consolidatedPattern?.preservedMetrics).toBeDefined();
    expect(consolidatedPattern?.preservedMetrics?.maxScore).toBe(0.95);
    expect(consolidatedPattern?.preservedMetrics?.avgScore).toBe(0.935);

    // Verify: Pattern C should remain independent
    const patternCResult = result.uniquePatterns.find(
      (p) =>
        p.customerScale === 'mid-size' &&
        p.industry === 'distribution' &&
        p.proposalApproach === 'free-trial'
    );
    expect(patternCResult).toBeDefined();
    expect(patternCResult?.matchScore).toBe(0.78);

    // Verify: Deduplication logic applies to all three criteria
    expect(result.deduplicationRules).toEqual({
      matchCriteria: ['customerScale', 'industry', 'proposalApproach'],
      appliedCriteria: 3,
    });
  });
});