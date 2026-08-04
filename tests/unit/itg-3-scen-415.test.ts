import { calculateDataQualityScore } from '../../src/logic/itg-3';

describe('AIエージェント推奨支援システム - データ品質スコア算出', () => {
  // SCEN-415
  test('検証結果が1件の場合、スコアが正しく算出される', () => {
    // Arrange
    const mockAIRecommendationEngine = {
      evaluatePatternRelevance: jest.fn().mockReturnValue(0.85),
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
    };

    const validationResults = [
      {
        id: 'val-001',
        itemName: '顧客情報の完全性',
        status: '合格',
        score: 95,
        timestamp: new Date('2024-01-15T10:00:00Z'),
      },
    ];

    // Act
    const result = calculateDataQualityScore(
      validationResults,
      mockAIRecommendationEngine
    );

    // Assert
    expect(result).toEqual({
      finalScore: 95,
      baseScore: 100,
      aiRelevanceAdjustment: 0.85,
      passCount: 1,
      totalCount: 1,
      passRate: 100,
    });
    expect(mockAIRecommendationEngine.evaluatePatternRelevance).toHaveBeenCalledWith(
      validationResults
    );
    expect(result.finalScore).toBe(95);
  });
});