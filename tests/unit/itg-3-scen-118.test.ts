import { generateRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('AIエージェント推奨支援システム - 類似パターン検索結果0件時の推論継続可否判定', () => {
  test('SCEN-118: 類似パターン検索結果が0件のとき evaluatePatternRelevance でエラーが発生する', () => {
    const mockAIEngine = {
      findSimilarPatterns: jest.fn().mockResolvedValue([]),
      generateRecommendation: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn().mockImplementation(() => {
        throw new TypeError('Cannot read property of undefined');
      }),
    };

    const preparationData = {
      customerIndustry: '製造業',
      budget: 5000000,
      challengePattern: '生産効率化',
    };

    expect(() => {
      generateRecommendation(preparationData, mockAIEngine);
    }).toThrow(/パターン/);
  });
});