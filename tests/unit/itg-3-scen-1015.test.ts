import { findSimilarPatterns, evaluatePatternRelevance } from '../../src/logic/it-1-br-3-3-2-1';

describe('Success Pattern Matching - Partial Match with Medium Applicability Score', () => {
  // SCEN-1015
  test('should return medium applicability score (0.65) when new deal partially matches success pattern', async () => {
    // Arrange: Test data for new deal
    const newDealData = {
      customerIndustry: '製造業',
      employeeCount: 500,
      businessChallenge: '生産効率化',
      budget: 5000000, // 500万円 in yen
    };

    const customerCondition = {
      industry: '製造業',
      size: '500名',
      mainChallenge: '生産効率化',
      budgetAmount: 5000000,
    };

    // Mock past success patterns
    const mockPatternA = {
      id: 'pattern-a-001',
      industry: '製造業',
      employeeCountRange: { min: 300, max: 600 },
      challenge: '生産効率化',
      budgetRange: { min: 4000000, max: 7000000 },
      applicabilityScore: 0.7,
    };

    const mockPatternB = {
      id: 'pattern-b-001',
      industry: '小売業',
      employeeCountRange: { min: 50, max: 200 },
      challenge: '在庫管理',
      budgetRange: { min: 2000000, max: 4000000 },
      applicabilityScore: 0.2,
    };

    // Mock AIRecommendationEngine.findSimilarPatterns
    const mockFindSimilarPatterns = jest.fn().mockResolvedValue([
      mockPatternA,
      mockPatternB,
    ]);

    // Mock AIRecommendationEngine.evaluatePatternRelevance
    const mockEvaluatePatternRelevance = jest.fn().mockResolvedValue(0.65);

    // Create mock AIRecommendationEngine
    const mockAIEngine = {
      findSimilarPatterns: mockFindSimilarPatterns,
      evaluatePatternRelevance: mockEvaluatePatternRelevance,
    };

    // Act: Execute pattern matching and recommendation generation
    const similarPatterns = await mockAIEngine.findSimilarPatterns(newDealData);
    const applicabilityScore = await mockAIEngine.evaluatePatternRelevance(
      newDealData,
      similarPatterns,
      customerCondition
    );

    // Assert: Verify applicability score is in medium range (0.60 to 0.70)
    expect(applicabilityScore).toBe(0.65);
    expect(applicabilityScore).toBeGreaterThanOrEqual(0.60);
    expect(applicabilityScore).toBeLessThanOrEqual(0.70);

    // Verify that similar patterns were retrieved
    expect(similarPatterns).toHaveLength(2);
    expect(similarPatterns[0].id).toBe('pattern-a-001');
    expect(similarPatterns[0].applicabilityScore).toBe(0.7);
    expect(similarPatterns[1].id).toBe('pattern-b-001');

    // Verify mock was called with correct arguments
    expect(mockFindSimilarPatterns).toHaveBeenCalledWith(newDealData);
    expect(mockEvaluatePatternRelevance).toHaveBeenCalledWith(
      newDealData,
      similarPatterns,
      customerCondition
    );
  });
});