import { extractImprovementItems } from '../../src/logic/itg-3';

describe('AIエージェント推奨支援システム - 改善対象項目抽出機能', () => {
  // SCEN-423
  test('不整合ログが0件の場合、改善対象項目が0件で返される', () => {
    const inconsistencyLogs: never[] = [];
    
    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const result = extractImprovementItems({
      inconsistencyLogs,
      aiEngine: mockAIRecommendationEngine,
    });

    expect(result.status).toBe('success');
    expect(result.improvementItems).toEqual([]);
    expect(result.improvementItems.length).toBe(0);
  });
});