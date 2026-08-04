import { classifyErrorsByCategory } from '../../src/logic/itg-3';

describe('AIエージェント推奨支援システム - エラーカテゴリ別分類機能', () => {
  // SCEN-447
  test('不整合ログが0件の場合、分類されたカテゴリが0件で返される', async () => {
    const inconsistencyLogs: Array<{
      id: string;
      message: string;
      severity: string;
      timestamp: string;
    }> = [];

    const mockAIEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const result = await classifyErrorsByCategory(inconsistencyLogs, mockAIEngine);

    expect(result).toEqual([]);
    expect(result.length).toBe(0);
    expect(Array.isArray(result)).toBe(true);
  });
});