import { visualizeRecommendationReasoning } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-2547
  test('推奨根拠が0件のとき、空配列を返す', () => {
    const recommendationId = 'rec-12345';
    const mockAIEngine = {
      explainRecommendationReasoning: jest.fn().mockReturnValue([]),
    };

    const result = visualizeRecommendationReasoning(
      recommendationId,
      mockAIEngine
    );

    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(0);
    expect(typeof result).toBe('object');
    expect(JSON.stringify(result)).toBe('[]');
  });
});