import { evaluateRecommendationFeasibility } from '../../src/logic/it-1-br-3-3-2-1';

const mockAIRecommendationEngine = {
  evaluatePatternRelevance: jest.fn(),
};

describe('Recommendation Feasibility Evaluation - Trust Score Zero', () => {
  test('SCEN-1730: should calculate recommendation score as 0 when pattern trust score is 0', () => {
    // Arrange
    fetchMock.resetMocks();

    const patternRelevanceResult = {
      trustScore: 0,
      matchingRate: 85,
      customerConditionAlignment: 90,
    };

    mockAIRecommendationEngine.evaluatePatternRelevance.mockReturnValue(
      patternRelevanceResult
    );

    const dealInput = {
      dealId: 'deal-12345',
      customerId: 'cust-67890',
      customerIndustry: 'manufacturing',
      customerScale: 'large',
      dealAmount: 5000000,
      dealStage: 'proposal',
      productCategory: 'enterprise-solution',
      successPatternId: 'pattern-001',
      historicalMatchRate: 85,
      customerConditionAlignmentScore: 90,
    };

    // Act
    const result = evaluateRecommendationFeasibility(dealInput, mockAIRecommendationEngine);

    // Assert
    expect(result.recommendationScore).toBe(0);
    expect(mockAIRecommendationEngine.evaluatePatternRelevance).toHaveBeenCalledWith(
      expect.objectContaining({
        dealId: dealInput.dealId,
        successPatternId: dealInput.successPatternId,
      })
    );
  });
});