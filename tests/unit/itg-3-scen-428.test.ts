import { decideGuidancePolicy } from '../../src/logic/itg-3';

describe('AIエージェント推奨支援システム - 指導方針決定機能', () => {
  test('SCEN-428: スコア100点の場合、方針が「継続維持」と決定される', () => {
    // Arrange
    const mockAIEngine = {
      evaluatePatternRelevance: jest.fn().mockResolvedValue({
        patternId: 'SUCCESS_PATTERN_001',
        applicabilityScore: 100,
        policyRecommendation: '継続維持',
      }),
    };

    const inputData = {
      dataQualityScore: 100,
      salesDataQuality: {
        completeness: 100,
        consistency: 100,
        timeliness: 100,
      },
      recommendationHistory: {
        successCount: 50,
        totalCount: 50,
      },
    };

    // Act
    const result = decideGuidancePolicy(inputData, mockAIEngine);

    // Assert
    expect(result).toEqual({
      policy: '継続維持',
      patternId: 'SUCCESS_PATTERN_001',
      applicabilityScore: 100,
    });
    expect(mockAIEngine.evaluatePatternRelevance).toHaveBeenCalledWith(
      expect.objectContaining({
        dataQualityScore: 100,
      })
    );
  });
});