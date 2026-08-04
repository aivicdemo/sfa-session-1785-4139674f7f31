import { visualizeRecommendationReasoning } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-213
  test('推奨根拠テーブルから複数の根拠レコードを取得し、全件が正常に可視化される', () => {
    const recommendationId = 'REC-123';

    const reasoningRecord1 = {
      reasoningId: 'R001',
      recommendationId: 'REC-123',
      reasoningType: '過去成功事例',
      score: 0.95,
    };

    const reasoningRecord2 = {
      reasoningId: 'R002',
      recommendationId: 'REC-123',
      reasoningType: '類似顧客層',
      score: 0.88,
    };

    const reasoningRecord3 = {
      reasoningId: 'R003',
      recommendationId: 'REC-123',
      reasoningType: '業界トレンド',
      score: 0.82,
    };

    const mockAIEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendationId: 'REC-123',
        reasoningRecords: [reasoningRecord1, reasoningRecord2, reasoningRecord3],
      }),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const result = visualizeRecommendationReasoning(recommendationId, mockAIEngine);

    expect(result).toBeDefined();
    expect(result.recommendationId).toBe('REC-123');
    expect(result.visualizedReasons).toHaveLength(3);

    expect(result.visualizedReasons[0]).toEqual({
      reasoningId: 'R001',
      recommendationId: 'REC-123',
      reasoningType: '過去成功事例',
      score: 0.95,
    });

    expect(result.visualizedReasons[1]).toEqual({
      reasoningId: 'R002',
      recommendationId: 'REC-123',
      reasoningType: '類似顧客層',
      score: 0.88,
    });

    expect(result.visualizedReasons[2]).toEqual({
      reasoningId: 'R003',
      recommendationId: 'REC-123',
      reasoningType: '業界トレンド',
      score: 0.82,
    });

    expect(result.visualizedReasons.every((reason) => reason.recommendationId === 'REC-123')).toBe(true);

    const scores = result.visualizedReasons.map((reason) => reason.score);
    expect(scores).toEqual([0.95, 0.88, 0.82]);
  });
});