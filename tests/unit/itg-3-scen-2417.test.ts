import { calculateRecommendationScore } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-2417: [edge] 推奨精度スコア算出機能 - 推奨精度スコアが99点のときスコア値99が返却される
  test('推奨精度スコアが99点のときスコア値99が返却される', () => {
    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn().mockReturnValue(99.0),
    };

    const result = calculateRecommendationScore(mockAIRecommendationEngine);

    expect(typeof result).toBe('number');
    expect(result).toBe(99);
    expect(Number.isInteger(result)).toBe(true);
  });
});