import { calculateRecommendationAccuracyScore } from '../../src/logic/it-1-br-3-2-1-1';

describe('AIエージェント推奨内容の根拠表示機能', () => {
  // SCEN-2451
  test('推奨精度スコア算出機能 - 提案内容の適合性判定スコアが0.0のときスコア計算に最小値として反映される', () => {
    const mockAIRecommendationEngine = {
      evaluatePatternRelevance: jest.fn().mockReturnValue(0.0),
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
    };

    const testInput = {
      conformityScore: 0.0,
      similarityScore: 0.85,
      confidenceScore: 0.90,
      aiEngine: mockAIRecommendationEngine,
    };

    const result = calculateRecommendationAccuracyScore(testInput);

    expect(result).toBe(0.0);
    expect(mockAIRecommendationEngine.evaluatePatternRelevance).toHaveBeenCalled();
  });
});