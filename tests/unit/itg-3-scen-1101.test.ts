import { explainRecommendationReasoning } from '../../src/logic/it-1-br-3-2-1-1';

describe('AIエージェント推奨内容の根拠表示機能', () => {
  // SCEN-1101
  test('推奨根拠レコードが0件のとき、根拠表示処理がエラーになる', () => {
    const recommendationPatternId = 'pattern-001';
    const mockAIEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn().mockResolvedValue({
        patternId: recommendationPatternId,
        reasoningBasis: [],
      }),
      evaluatePatternRelevance: jest.fn(),
    };

    const mockDatabaseQuery = jest.fn().mockResolvedValue([]);

    expect(async () => {
      await explainRecommendationReasoning(
        recommendationPatternId,
        mockAIEngine,
        mockDatabaseQuery
      );
    }).toThrow(/推奨根拠レコード/);
  });
});