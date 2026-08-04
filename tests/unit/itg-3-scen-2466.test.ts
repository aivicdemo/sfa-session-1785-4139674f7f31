import { explainRecommendationReasoning } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-2466
  test('[normal] 推奨根拠が0件のとき、空状態として可視化される', async () => {
    // Arrange
    const mockAIRecommendationEngine = {
      explainRecommendationReasoning: jest.fn().mockResolvedValue([]),
    };

    const recommendationId = 'rec-001';
    const salesPersonId = 'sales-user-001';

    // Act
    const result = await explainRecommendationReasoning(
      recommendationId,
      salesPersonId,
      mockAIRecommendationEngine
    );

    // Assert
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(0);
    expect(result).toEqual([]);
    expect(mockAIRecommendationEngine.explainRecommendationReasoning).toHaveBeenCalledWith(
      recommendationId,
      salesPersonId
    );
    expect(mockAIRecommendationEngine.explainRecommendationReasoning).toHaveBeenCalledTimes(1);
  });
});