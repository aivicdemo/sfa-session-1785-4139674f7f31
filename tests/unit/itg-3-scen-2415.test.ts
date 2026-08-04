import { calculateRecommendationScore } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-2415
  test('推奨精度スコアが1点のときスコア値1が返却される', () => {
    const mockAIRecommendationEngine = {
      evaluatePatternRelevance: jest.fn().mockReturnValue(1.0),
    };

    const input = {
      relevanceScore: 1.0,
    };

    const result = calculateRecommendationScore(input, mockAIRecommendationEngine);

    expect(typeof result).toBe('number');
    expect(result).toBe(1);
  });
});