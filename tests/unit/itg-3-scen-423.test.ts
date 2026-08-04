import { extractImprovementTargets } from '../../src/logic/itg-3';

describe('AIエージェント推奨支援システム', () => {
  // SCEN-423
  test('改善対象項目抽出機能 - 不整合ログが0件の場合、改善対象項目が0件で返される', () => {
    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const inputParams = {
      inconsistencyLogCount: 0,
      dataQualityCheckResults: [],
      aiEngine: mockAIRecommendationEngine,
    };

    const result = extractImprovementTargets(inputParams);

    expect(result.status).toBe('success');
    expect(result.improvementTargets).toEqual([]);
    expect(result.improvementTargets.length).toBe(0);
  });
});