import { analyzeContactPattern } from '../../src/logic/it-1-br-3-1-1-1';

describe('顧客対応の接触パターン分析 - 余剰接触による乖離スコア算出', () => {
  // SCEN-2203
  test('接触回数が成功パターンより1回多いとき、余剰接触による乖離スコアが算出される', () => {
    const successPatternContactCount = 5;
    const currentContactCount = 6;
    const excessContactCount = currentContactCount - successPatternContactCount;
    const expectedDiscrepancyScore = 0.25;

    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn().mockReturnValue({
        relevanceScore: 75,
        discrepancyScore: expectedDiscrepancyScore,
      }),
    };

    const result = analyzeContactPattern(
      {
        contactCount: currentContactCount,
        successPatternContactCount: successPatternContactCount,
      },
      mockAIRecommendationEngine
    );

    expect(mockAIRecommendationEngine.evaluatePatternRelevance).toHaveBeenCalled();
    expect(result.discrepancyScore).toBeGreaterThan(0);
    expect(result.discrepancyScore).toBe(expectedDiscrepancyScore);
    expect(result.excessContactCount).toBe(excessContactCount);
  });
});