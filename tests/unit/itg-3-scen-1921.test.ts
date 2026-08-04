import { evaluatePatternRelevance } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-1921
  test('推奨スコアの計算に端数が出るときに指定の精度で丸められる', () => {
    const mockAIRecommendationEngine = {
      evaluatePatternRelevance: jest.fn().mockReturnValue(3.14159265),
    };

    const scorePrecision = 2;
    const rawScore = mockAIRecommendationEngine.evaluatePatternRelevance();
    
    const roundedScore = Math.round(rawScore * Math.pow(10, scorePrecision)) / Math.pow(10, scorePrecision);

    const result = evaluatePatternRelevance(
      {
        rawScore: rawScore,
        precision: scorePrecision,
        aiEngine: mockAIRecommendationEngine,
      }
    );

    expect(result.displayScore).toBe(3.14);
    expect(result.rootCausePanel.score).toBe(3.14);
  });
});