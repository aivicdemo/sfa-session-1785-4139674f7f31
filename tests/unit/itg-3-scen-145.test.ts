import { explainRecommendationReasoning } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-145: [edge] 推奨根拠の可視化機能 - 根拠情報が複数件のときにリスト形式として可視化される
  test('should display multiple recommendation reasons in list format sorted by score descending', async () => {
    const mockRecommendationId = 'rec-12345';
    const mockAIRecommendationEngine = {
      explainRecommendationReasoning: jest.fn().mockResolvedValue([
        {
          reason: '過去事例A',
          score: 0.95,
        },
        {
          reason: '過去事例B',
          score: 0.87,
        },
        {
          reason: '過去事例C',
          score: 0.82,
        },
      ]),
    };

    const result = await explainRecommendationReasoning(
      mockRecommendationId,
      mockAIRecommendationEngine
    );

    expect(result).toHaveLength(3);
    expect(result[0]).toEqual({
      reason: '過去事例A',
      score: 0.95,
    });
    expect(result[1]).toEqual({
      reason: '過去事例B',
      score: 0.87,
    });
    expect(result[2]).toEqual({
      reason: '過去事例C',
      score: 0.82,
    });

    expect(result[0].score).toBeGreaterThan(result[1].score);
    expect(result[1].score).toBeGreaterThan(result[2].score);

    expect(mockAIRecommendationEngine.explainRecommendationReasoning).toHaveBeenCalledWith(
      mockRecommendationId
    );
  });
});