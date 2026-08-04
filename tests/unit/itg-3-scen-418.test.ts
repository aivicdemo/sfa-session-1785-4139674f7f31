import { evaluateDataQualityScore } from '../../src/logic/itg-3';

describe('AIエージェント推奨支援システム - データ品質スコア算出機能', () => {
  // SCEN-418: [normal] データ品質スコアが閾値直下の場合、正しい改善優先度ランクが付与される
  test('should assign High priority rank when data quality score is just below threshold', () => {
    // Arrange
    const threshold = 70;
    const scoreJustBelowThreshold = 69.5;
    const dealId = 'DEAL-001';
    const now = new Date('2024-01-15T11:00:00Z');

    const mockAIEngine = {
      evaluatePatternRelevance: jest.fn().mockResolvedValue({
        score: scoreJustBelowThreshold,
        dealId: dealId,
      }),
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
    };

    const inputData = {
      dealId: dealId,
      customerId: 'CUST-001',
      dealStatus: 'open',
      dealAmount: 50000,
      threshold: threshold,
      evaluationTimestamp: now.toISOString(),
    };

    // Act
    const result = evaluateDataQualityScore(
      inputData,
      mockAIEngine
    );

    // Assert
    expect(result).toBeDefined();
    expect(result.qualityScore).toBe(69.5);
    expect(result.priorityRank).toBe(1);
    expect(result.priorityRankLabel).toBe('HIGH');
    expect(result.rankReason).toContain('スコアが閾値未満のため改善が必要');

    // Validate timestamp is recorded and within ±5 seconds
    const rankTimestamp = new Date(result.rankAssignedAt);
    const timeDiff = Math.abs(rankTimestamp.getTime() - now.getTime());
    expect(timeDiff).toBeLessThanOrEqual(5000);

    // Verify AI engine was called with correct parameters
    expect(mockAIEngine.evaluatePatternRelevance).toHaveBeenCalledWith(
      expect.objectContaining({
        dealId: dealId,
      })
    );
  });
});