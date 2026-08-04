import { generateRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('AIエージェント推奨支援システム - OpenAI API応答不可時のキャッシュ代替表示', () => {
  // SCEN-927
  test('OpenAI APIがタイムアウトした場合、キャッシュされた過去推奨履歴から類似案件が代替表示される', async () => {
    const cached_recommendations = [
      {
        id: 'cached_1',
        customer_scale: 'mid_market',
        industry: 'manufacturing',
        success_score: 0.92,
        proposal_approach: '生産効率化ソリューション提案',
        created_at: '2024-01-10T09:00:00Z',
      },
      {
        id: 'cached_3',
        customer_scale: 'mid_market',
        industry: 'manufacturing',
        success_score: 0.85,
        proposal_approach: 'コスト削減型導入プラン提案',
        created_at: '2024-01-05T14:30:00Z',
      },
      {
        id: 'cached_2',
        customer_scale: 'enterprise',
        industry: 'finance',
        success_score: 0.88,
        proposal_approach: 'エンタープライズ規模統合提案',
        created_at: '2024-01-08T11:15:00Z',
      },
    ];

    const retry_logs: Array<{ attempt: number; timestamp: string; error: string }> = [];
    const mock_ai_engine = {
      generateRecommendation: jest.fn().mockImplementation(() => {
        const attempt_num = retry_logs.length + 1;
        retry_logs.push({
          attempt: attempt_num,
          timestamp: new Date('2024-01-15T11:00:00Z').toISOString(),
          error: 'API timeout exceeded 30 seconds',
        });
        throw new Error('API timeout exceeded 30 seconds');
      }),
      findSimilarPatterns: jest.fn().mockImplementation(() => {
        throw new Error('API timeout exceeded 30 seconds');
      }),
      explainRecommendationReasoning: jest.fn().mockImplementation(() => {
        throw new Error('API timeout exceeded 30 seconds');
      }),
    };

    const new_deal_input = {
      customer_scale: 'mid_market',
      industry: 'manufacturing',
      deal_stage: 'pre_proposal',
      budget_amount_min: 5000000,
    };

    const result = await generateRecommendation(
      new_deal_input,
      mock_ai_engine,
      cached_recommendations,
      { max_retries: 3, retry_intervals_ms: [1000, 2000, 4000], timeout_ms: 30000 }
    );

    expect(retry_logs.length).toBe(3);
    expect(retry_logs[0].attempt).toBe(1);
    expect(retry_logs[1].attempt).toBe(2);
    expect(retry_logs[2].attempt).toBe(3);

    expect(result.user_message).toBe(
      '推奨の生成に一時的な遅延が発生しています。過去の推奨履歴から類似案件を表示します'
    );

    expect(result.recommendations).toHaveLength(2);
    expect(result.recommendations[0].id).toBe('cached_1');
    expect(result.recommendations[0].success_score).toBe(0.92);
    expect(result.recommendations[0].industry).toBe('manufacturing');
    expect(result.recommendations[0].customer_scale).toBe('mid_market');

    expect(result.recommendations[1].id).toBe('cached_3');
    expect(result.recommendations[1].success_score).toBe(0.85);
    expect(result.recommendations[1].industry).toBe('manufacturing');
    expect(result.recommendations[1].customer_scale).toBe('mid_market');

    expect(result.reasoning_summary).toBe('過去の同業種・同規模の成功事例から推奨');

    expect(result.recommendation_source).toBe('cached_fallback');
  });
});