import { findSimilarPatterns } from '../../src/logic/it-1-br-3-3-2-1';

describe('Similar Customer Matching - Year-Boundary Period Calculation', () => {
  // SCEN-1616
  test('should correctly calculate similarity score when past purchase period spans fiscal year boundary', async () => {
    const mockAIEngine = {
      findSimilarPatterns: jest.fn(),
      generateRecommendation: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const pastCustomerData = {
      customerId: 'CUST-001',
      purchasePeriodStart: new Date('2024-11-01'),
      purchasePeriodEnd: new Date('2025-03-31'),
      purchaseDays: 152,
      industry: 'Manufacturing',
      companySize: 'Large',
      productCategory: 'Enterprise Solution',
    };

    const currentProposalPeriod = {
      proposalStart: new Date('2025-04-01'),
      proposalEnd: new Date('2025-08-31'),
      proposalDays: 153,
    };

    const expectedSimilarityScore = 0.82;

    mockAIEngine.findSimilarPatterns.mockResolvedValue({
      similarPatterns: [
        {
          patternId: 'PATTERN-001',
          matchedCustomerId: pastCustomerData.customerId,
          periodOverlapDays: 0,
          periodSimilarityScore: expectedSimilarityScore,
          industryMatch: true,
          sizeMatch: true,
          productCategoryMatch: true,
          cumulativeScore: expectedSimilarityScore,
        },
      ],
      metadata: {
        yearBoundaryProcessed: true,
        pastPeriodStart: pastCustomerData.purchasePeriodStart.toISOString(),
        pastPeriodEnd: pastCustomerData.purchasePeriodEnd.toISOString(),
        proposalPeriodStart: currentProposalPeriod.proposalStart.toISOString(),
        proposalPeriodEnd: currentProposalPeriod.proposalEnd.toISOString(),
        calculationBasis: 'period_similarity_with_year_boundary_handling',
      },
    });

    const result = await findSimilarPatterns(
      {
        customerId: pastCustomerData.customerId,
        industry: pastCustomerData.industry,
        companySize: pastCustomerData.companySize,
        productCategory: pastCustomerData.productCategory,
        purchasePeriodStart: pastCustomerData.purchasePeriodStart,
        purchasePeriodEnd: pastCustomerData.purchasePeriodEnd,
      },
      {
        proposalStart: currentProposalPeriod.proposalStart,
        proposalEnd: currentProposalPeriod.proposalEnd,
      },
      mockAIEngine
    );

    expect(result).toBeDefined();
    expect(result.similarPatterns).toBeDefined();
    expect(result.similarPatterns.length).toBeGreaterThan(0);

    const matchedPattern = result.similarPatterns[0];
    expect(matchedPattern.periodSimilarityScore).toBeGreaterThanOrEqual(0.7);
    expect(matchedPattern.periodSimilarityScore).toBeLessThanOrEqual(0.95);
    expect(matchedPattern.periodSimilarityScore).toBe(expectedSimilarityScore);

    expect(result.metadata).toBeDefined();
    expect(result.metadata.yearBoundaryProcessed).toBe(true);
    expect(result.metadata.pastPeriodStart).toBe(
      pastCustomerData.purchasePeriodStart.toISOString()
    );
    expect(result.metadata.pastPeriodEnd).toBe(
      pastCustomerData.purchasePeriodEnd.toISOString()
    );
    expect(result.metadata.proposalPeriodStart).toBe(
      currentProposalPeriod.proposalStart.toISOString()
    );
    expect(result.metadata.proposalPeriodEnd).toBe(
      currentProposalPeriod.proposalEnd.toISOString()
    );
    expect(result.metadata.calculationBasis).toBe(
      'period_similarity_with_year_boundary_handling'
    );

    expect(mockAIEngine.findSimilarPatterns).toHaveBeenCalledTimes(1);
  });
});