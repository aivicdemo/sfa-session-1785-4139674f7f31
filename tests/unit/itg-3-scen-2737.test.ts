import { explainRecommendationReasoning } from '../../src/logic/it-1-br-3-2-1-1';

describe('AIエージェント推奨内容の根拠表示機能', () => {
  // SCEN-2737
  test('生成履歴レコードが不完全なとき根拠追跡が失敗する', () => {
    const incompleteGenerationHistoryRecord = {
      id: 'gen_history_001',
      recommendation_id: 'rec_12345',
      generation_timestamp: null,
      pattern_source: null,
      confidence_score: null,
      created_at: '2024-01-15T10:00:00Z',
    };

    const aiRecommendationEngineStub = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    expect(() =>
      explainRecommendationReasoning(
        incompleteGenerationHistoryRecord,
        aiRecommendationEngineStub
      )
    ).toThrow(/generation_timestamp|pattern_source|confidence_score/);
  });
});