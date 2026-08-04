import { findSimilarPatterns } from '../../src/logic/it-1-br-3-3-2-1';

describe('AIエージェント推奨支援 - 類似パターン検索', () => {
  // SCEN-2148
  test('findSimilarPatterns の検索結果が空配列のとき、エラーが発生する', () => {
    const mockAIEngine = {
      findSimilarPatterns: jest.fn().mockResolvedValue([]),
      generateRecommendation: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const dealCondition = {
      customerIndustry: '製造業',
      projectScale: '1000万円以上',
      proposalType: 'システム導入',
    };

    expect(
      async () =>
        await findSimilarPatterns(dealCondition, mockAIEngine)
    ).rejects.toThrow(/類似パターンが見つかりません/);
  });
});