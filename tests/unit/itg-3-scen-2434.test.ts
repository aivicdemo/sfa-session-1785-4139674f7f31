import { evaluateRecommendationScore } from '../../src/logic/it-1-br-3-3-2-1';

describe('推奨精度スコア算出機能 - 成功パターン適用可能性評価', () => {
  test('SCEN-2434: 適用可能性スコアが0.0のときマッチ対象外として判定される', () => {
    // Arrange
    const mockAIRecommendationEngine = {
      evaluatePatternRelevance: jest.fn((pattern) => {
        if (pattern.id === 'pattern_zero_score') {
          return 0.0;
        }
        return 0.85;
      }),
    };

    const newDealData = {
      customerIndustry: 'IT',
      dealAmount: 5000000,
      decisionMakersCount: 3,
      implementationPeriodDays: 90,
    };

    const successPatterns = [
      {
        id: 'pattern_zero_score',
        customerIndustry: 'IT',
        dealAmountMin: 4000000,
        dealAmountMax: 6000000,
        successRate: 0.92,
        matchStatus: 'PENDING',
      },
      {
        id: 'pattern_valid',
        customerIndustry: 'IT',
        dealAmountMin: 3000000,
        dealAmountMax: 7000000,
        successRate: 0.88,
        matchStatus: 'PENDING',
      },
    ];

    // Act
    const result = evaluateRecommendationScore(
      newDealData,
      successPatterns,
      mockAIRecommendationEngine
    );

    // Assert
    expect(result.recommendedPatterns).toHaveLength(1);
    expect(result.recommendedPatterns[0].id).toBe('pattern_valid');
    expect(result.recommendedPatterns).not.toContainEqual(
      expect.objectContaining({ id: 'pattern_zero_score' })
    );

    const excludedPattern = result.patternStatuses.find(
      (p) => p.id === 'pattern_zero_score'
    );
    expect(excludedPattern).toBeDefined();
    expect(excludedPattern?.status).toBe('マッチ対象外');
    expect(excludedPattern?.relevanceScore).toBe(0.0);

    expect(mockAIRecommendationEngine.evaluatePatternRelevance).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'pattern_zero_score' })
    );
    expect(mockAIRecommendationEngine.evaluatePatternRelevance).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'pattern_valid' })
    );
  });
});