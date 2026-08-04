import { evaluatePatternRelevance } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン適用可能性の評価', () => {
  // SCEN-2151
  test('新規案件の条件が null のとき、エラーが発生する', () => {
    const mockAIEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(() => {
        throw new TypeError('新規案件の条件は必須項目です');
      }),
    };

    expect(() =>
      evaluatePatternRelevance(null, mockAIEngine)
    ).toThrow(/条件|必須/);
  });
});