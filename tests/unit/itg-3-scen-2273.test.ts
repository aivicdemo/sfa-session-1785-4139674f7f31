import { explainRecommendationReasoning } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-2273
  test('AIエージェント生成履歴に該当レコードがないとき、根拠表示でエラーになる', async () => {
    const recommendation_id = 'REC-20240115-001';
    const user_id = 'USER-001';

    const mock_ai_engine = {
      explainRecommendationReasoning: jest.fn().mockResolvedValue(null),
    };

    const mock_database = {
      query: jest.fn().mockResolvedValue([]),
    };

    const error = await explainRecommendationReasoning(
      recommendation_id,
      user_id,
      mock_ai_engine,
      mock_database
    ).catch((err) => err);

    expect(error).toBeDefined();
    expect(error.code).toBe('GENERATION_HISTORY_NOT_FOUND');
    expect(error.message).toMatch(/生成履歴/);
  });
});