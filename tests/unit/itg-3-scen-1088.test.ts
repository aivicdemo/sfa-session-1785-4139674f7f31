import { generateRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン抽出・照合機能', () => {
  // SCEN-1088
  test('類似パターン検索結果が0件のとき、推奨生成処理がエラーになる', () => {
    const testCaseInput = {
      customerName: 'Test Corp',
      budget: 5000000,
      implementationPeriodMonths: 3,
    };

    const mockAIRecommendationEngine = {
      findSimilarPatterns: jest.fn().mockResolvedValue([]),
      generateRecommendation: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    expect(() =>
      generateRecommendation(testCaseInput, mockAIRecommendationEngine)
    ).toThrow(/類似パターン/);
  });
});