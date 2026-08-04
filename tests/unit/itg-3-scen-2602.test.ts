import { evaluatePatternRelevance } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターンテンプレート自動判定機能', () => {
  // SCEN-2602
  test('複数の成功パターンが同一の適合度スコアを持つ場合、すべてのパターンが推奨出力に含まれる', () => {
    const patternA = {
      id: 'pattern-a',
      name: 'Pattern A',
      customerIndustry: 'Technology',
      dealAmount: 500000,
      decisionMakers: 2,
    };

    const patternB = {
      id: 'pattern-b',
      name: 'Pattern B',
      customerIndustry: 'Technology',
      dealAmount: 500000,
      decisionMakers: 2,
    };

    const patternC = {
      id: 'pattern-c',
      name: 'Pattern C',
      customerIndustry: 'Technology',
      dealAmount: 500000,
      decisionMakers: 2,
    };

    const successPatterns = [patternA, patternB, patternC];

    const newDealCondition = {
      customerIndustry: 'Technology',
      dealAmount: 500000,
      decisionMakers: 2,
    };

    const mockEvaluatePatternRelevance = jest.fn((pattern, condition) => {
      return 0.85;
    });

    const mockFindSimilarPatterns = jest.fn((condition) => {
      return successPatterns;
    });

    const mockAIRecommendationEngine = {
      evaluatePatternRelevance: mockEvaluatePatternRelevance,
      findSimilarPatterns: mockFindSimilarPatterns,
    };

    const result = evaluatePatternRelevance(
      successPatterns,
      newDealCondition,
      mockAIRecommendationEngine
    );

    expect(mockFindSimilarPatterns).toHaveBeenCalledWith(newDealCondition);

    expect(result.recommendedPatterns).toHaveLength(3);
    expect(result.recommendedPatterns).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: 'pattern-a', relevanceScore: 0.85 }),
        expect.objectContaining({ id: 'pattern-b', relevanceScore: 0.85 }),
        expect.objectContaining({ id: 'pattern-c', relevanceScore: 0.85 }),
      ])
    );

    result.recommendedPatterns.forEach((pattern) => {
      expect(pattern.relevanceScore).toBe(0.85);
    });

    expect(mockEvaluatePatternRelevance).toHaveBeenCalledTimes(3);
  });
});