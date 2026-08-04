import { RecommendationScoreCalculator } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-2416
  test('推奨精度スコア算出機能 - 推奨精度スコアが100点のときスコア値100が返却される', () => {
    const mockAIRecommendationEngine = {
      evaluatePatternRelevance: jest.fn().mockReturnValue(100),
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
    };

    const calculator = new RecommendationScoreCalculator(mockAIRecommendationEngine);
    const score = calculator.calculateScore();

    expect(score).toBe(100);
    expect(typeof score).toBe('number');
    expect(mockAIRecommendationEngine.evaluatePatternRelevance).toHaveBeenCalled();
  });
});