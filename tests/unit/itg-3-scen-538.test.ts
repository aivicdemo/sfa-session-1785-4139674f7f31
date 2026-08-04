import { extractImprovementItems } from '../../src/logic/it-1-br-3-2-1-1';

describe('AIエージェント推奨内容の根拠表示機能 - 改善対象項目抽出', () => {
  // SCEN-538: [edge] 改善対象項目抽出機能 - 改善優先度が閾値直上のときアイテムが抽出対象になる
  test('should include item with relevance score exactly at threshold and exclude item below threshold', () => {
    const threshold = 0.75;
    const itemA = {
      id: 'item-a',
      name: '提案内容の明確化',
      relevanceScore: 0.75,
    };
    const itemB = {
      id: 'item-b',
      name: '顧客ニーズの確認',
      relevanceScore: 0.74,
    };

    const mockAIEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn((item) => {
        if (item.id === 'item-a') {
          return Promise.resolve(0.75);
        }
        if (item.id === 'item-b') {
          return Promise.resolve(0.74);
        }
        return Promise.resolve(0);
      }),
    };

    const inputItems = [itemA, itemB];
    const result = extractImprovementItems(
      inputItems,
      threshold,
      mockAIEngine
    );

    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({
      id: 'item-a',
      name: '提案内容の明確化',
      relevanceScore: 0.75,
    });
    expect(result.some(item => item.id === 'item-b')).toBe(false);
  });
});