import { generateRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('AI Recommendation Engine - Multiple Deal Condition Evaluation', () => {
  test('SCEN-1033: generateRecommendation evaluates all deal conditions and returns structured scores', async () => {
    // Setup: Create mock AIRecommendationEngine stub
    const mockAIRecommendationEngine = {
      evaluatePatternRelevance: jest.fn()
        .mockResolvedValueOnce({ score: 0.85, dealConditionId: 'cond-a' })
        .mockResolvedValueOnce({ score: 0.72, dealConditionId: 'cond-b' })
        .mockResolvedValueOnce({ score: 0.91, dealConditionId: 'cond-c' }),
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
    };

    // Input: New case data with 3 deal conditions
    const newCaseData = {
      customerId: 'cust-001',
      customerName: 'ABC Corporation',
      industry: 'Manufacturing',
      dealConditions: [
        {
          id: 'cond-a',
          budget: 5000000,
          implementationPeriodMonths: 3,
          industry: 'Manufacturing',
        },
        {
          id: 'cond-b',
          budget: 10000000,
          implementationPeriodMonths: 6,
          industry: 'Finance',
        },
        {
          id: 'cond-c',
          budget: 3000000,
          implementationPeriodMonths: 1,
          industry: 'Retail',
        },
      ],
    };

    // Execute: Call generateRecommendation with mock engine
    const result = await generateRecommendation(newCaseData, mockAIRecommendationEngine);

    // Assertion 1: Verify evaluatePatternRelevance was called exactly 3 times
    expect(mockAIRecommendationEngine.evaluatePatternRelevance).toHaveBeenCalledTimes(3);

    // Assertion 2: Verify each deal condition evaluation was invoked
    expect(mockAIRecommendationEngine.evaluatePatternRelevance).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        budget: 5000000,
        implementationPeriodMonths: 3,
        industry: 'Manufacturing',
      })
    );
    expect(mockAIRecommendationEngine.evaluatePatternRelevance).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        budget: 10000000,
        implementationPeriodMonths: 6,
        industry: 'Finance',
      })
    );
    expect(mockAIRecommendationEngine.evaluatePatternRelevance).toHaveBeenNthCalledWith(
      3,
      expect.objectContaining({
        budget: 3000000,
        implementationPeriodMonths: 1,
        industry: 'Retail',
      })
    );

    // Assertion 3: Verify response contains all 3 evaluation results
    expect(result.evaluationResults).toHaveLength(3);

    // Assertion 4: Verify score for condition A is 0.85
    expect(result.evaluationResults[0]).toEqual(
      expect.objectContaining({
        dealConditionId: 'cond-a',
        relevanceScore: 0.85,
      })
    );

    // Assertion 5: Verify score for condition B is 0.72
    expect(result.evaluationResults[1]).toEqual(
      expect.objectContaining({
        dealConditionId: 'cond-b',
        relevanceScore: 0.72,
      })
    );

    // Assertion 6: Verify score for condition C is 0.91
    expect(result.evaluationResults[2]).toEqual(
      expect.objectContaining({
        dealConditionId: 'cond-c',
        relevanceScore: 0.91,
      })
    );

    // Assertion 7: Verify response structure contains all required fields
    expect(result).toHaveProperty('customerId', 'cust-001');
    expect(result).toHaveProperty('evaluationResults');
    expect(result).toHaveProperty('recommendedApproaches');

    // Assertion 8: Verify evaluationResults array is structured correctly
    result.evaluationResults.forEach((evaluation: any) => {
      expect(evaluation).toHaveProperty('dealConditionId');
      expect(evaluation).toHaveProperty('relevanceScore');
      expect(typeof evaluation.relevanceScore).toBe('number');
      expect(evaluation.relevanceScore).toBeGreaterThanOrEqual(0);
      expect(evaluation.relevanceScore).toBeLessThanOrEqual(1);
    });
  });
});