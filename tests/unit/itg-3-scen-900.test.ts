import { findSimilarPatternsAndEvaluate } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン照合機能 - 商談条件ゼロ件入力時の早期リターン', () => {
  // SCEN-900
  test('商談条件が0個入力されたとき照合ロジックが成立しない', () => {
    const mockAIRecommendationEngine = {
      findSimilarPatterns: jest.fn().mockResolvedValue([]),
      evaluatePatternRelevance: jest.fn(),
      generateRecommendation: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
    };

    const dealConditions: any[] = [];

    const result = findSimilarPatternsAndEvaluate(dealConditions, mockAIRecommendationEngine);

    expect(result).toEqual({
      patterns: [],
      isValid: false,
      reason: '商談条件が入力されていません',
    });

    expect(mockAIRecommendationEngine.findSimilarPatterns).not.toHaveBeenCalled();
    expect(mockAIRecommendationEngine.evaluatePatternRelevance).not.toHaveBeenCalled();
  });
});