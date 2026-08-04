import { generateRecommendationWithFallback } from '../../src/logic/it-1-br-3-1-1-1';

const fetchMock = require('jest-fetch-mock');

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-1663
  test('AIRecommendationEngine の外部呼び出しが失敗したとき、代替処理が実行される', async () => {
    fetchMock.resetMocks();

    // AIRecommendationEngine への呼び出しを3回連続でエラーにする
    fetchMock.mockResponseOnce(
      JSON.stringify({
        error: 'Network connection failed',
        code: 'NETWORK_ERROR',
      }),
      { status: 503 }
    );
    fetchMock.mockResponseOnce(
      JSON.stringify({
        error: 'API service unavailable',
        code: 'SERVICE_UNAVAILABLE',
      }),
      { status: 503 }
    );
    fetchMock.mockResponseOnce(
      JSON.stringify({
        error: 'Request timeout',
        code: 'TIMEOUT',
      }),
      { status: 504 }
    );

    // テスト用の商談データ
    const dealData = {
      customer_id: 'CUST-20240115-001',
      customer_name: 'Alpha Corporation',
      industry: 'technology',
      company_size: 'large',
      deal_amount: 5000000,
      deal_stage: 'proposal',
      customer_needs: [
        'digital_transformation',
        'cost_reduction',
        'efficiency_improvement',
      ],
      previous_interactions: 3,
      estimated_closing_date: '2024-03-30T23:59:59Z',
    };

    const start_time = Date.now();

    // 推奨スコア算出機能を呼び出す
    const result = await generateRecommendationWithFallback(dealData);

    const end_time = Date.now();
    const total_duration_ms = end_time - start_time;

    // 再試行が3回実行されたことを確認（APIが3回呼ばれたことで検証）
    expect(fetchMock.calls().length).toBe(3);

    // 総実行時間がタイムアウト（30秒 = 30000ms）に収まったことを検証
    expect(total_duration_ms).toBeLessThan(30000);

    // 外部AI呼び出しが失敗したことを示すフラグを確認
    expect(result.success_source).toBe('fallback_pattern_master');

    // 返却されたパターンがマスタから取得されたことを確認
    expect(result.pattern_id).toBeDefined();
    expect(result.pattern_name).toBeDefined();
    expect(result.success_rate).toBeDefined();

    // 返却されたパターンのメタデータを確認
    expect(typeof result.pattern_id).toBe('string');
    expect(typeof result.pattern_name).toBe('string');
    expect(typeof result.success_rate).toBe('number');
    expect(result.success_rate).toBeGreaterThanOrEqual(0);
    expect(result.success_rate).toBeLessThanOrEqual(100);

    // 根拠説明が簡略版であることを確認（文字数が較短い）
    expect(result.reasoning_explanation).toBeDefined();
    expect(typeof result.reasoning_explanation).toBe('string');
    expect(result.reasoning_explanation.length).toBeGreaterThan(0);
    expect(result.reasoning_explanation.length).toBeLessThan(500);

    // 返却データが統計的に上位のパターンであることを確認
    expect(result.rank).toBeDefined();
    expect(result.rank).toBeGreaterThanOrEqual(1);
    expect(result.rank).toBeLessThanOrEqual(3);

    // ユーザー向けメッセージが正しく設定されていることを確認
    expect(result.user_message).toBe(
      '推奨の生成に一時的な遅延が発生しています。過去の推奨履歴から類似案件を表示します'
    );

    // レスポンスの必須フィールドを確認
    expect(result.recommendation_id).toBeDefined();
    expect(result.generated_at).toBeDefined();
    expect(typeof result.generated_at).toBe('string');

    // 代替推奨であることが明示されていることを確認
    expect(result.fallback_used).toBe(true);
  });
});