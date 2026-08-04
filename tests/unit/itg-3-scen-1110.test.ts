import { AIRecommendationEngine } from '../../src/logic/it-1-br-3-3-2-1';

describe('AI推奨エンジン - OpenAI API 404エラー時の代替パターンマスタ切り替え', () => {
  test('SCEN-1110: OpenAI API 404エラー時に代替パターンマスタから推奨を返却', async () => {
    // 新規案件の顧客・商談条件
    const dealCondition = {
      customer_industry: 'IT',
      deal_size: 'large',
      budget: 5000000,
    };

    // OpenAI API が404エラーを返すモック
    const mock_openai_api = jest.fn()
      .mockRejectedValueOnce(new Error('404 Not Found: model not found'))
      .mockRejectedValueOnce(new Error('404 Not Found: model not found'))
      .mockRejectedValueOnce(new Error('404 Not Found: model not found'));

    // 代替パターンマスタから返すモック推奨パターン
    const mock_fallback_patterns = [
      {
        pattern_id: 'P001',
        customer_industry: 'IT',
        deal_size: 'large',
        success_count: 45,
        approach: 'デジタル化推進提案',
        key_message: 'クラウドインフラ導入による効率化',
        recommendation_confidence: 87,
      },
      {
        pattern_id: 'P002',
        customer_industry: 'IT',
        deal_size: 'large',
        success_count: 38,
        approach: 'セキュリティ強化提案',
        key_message: 'エンタープライズグレード保護',
        recommendation_confidence: 82,
      },
      {
        pattern_id: 'P003',
        customer_industry: 'IT',
        deal_size: 'large',
        success_count: 32,
        approach: 'コスト最適化提案',
        key_message: '運用コスト削減戦略',
        recommendation_confidence: 78,
      },
    ];

    const mock_fallback_engine = jest.fn()
      .mockResolvedValue({
        patterns: mock_fallback_patterns,
        source: 'fallback_master',
        fallback_reason: '404 Not Found',
      });

    // システムレポート用の内部ログ配列
    const system_logs: Array<{
      timestamp: string;
      level: string;
      message: string;
      retry_count?: number;
      next_retry_delay_ms?: number;
    }> = [];

    // エンジン設定でモック API と代替エンジンを指定
    const engine_config = {
      openai_call: mock_openai_api,
      fallback_engine: mock_fallback_engine,
      max_retries: 3,
      initial_retry_delay_ms: 1000,
      system_logger: (log_entry: {
        timestamp: string;
        level: string;
        message: string;
        retry_count?: number;
        next_retry_delay_ms?: number;
      }) => {
        system_logs.push(log_entry);
      },
    };

    // AIRecommendationEngine を初期化・実行
    const engine = new AIRecommendationEngine(engine_config);
    const result = await engine.generateRecommendation(dealCondition);

    // ---- 検証 ----

    // (1) 指数バックオフで最大3回の再試行が実行されていることをログで確認
    const retry_logs = system_logs.filter(
      (log) => log.message.includes('retry') || log.message.includes('再試行')
    );
    expect(retry_logs.length).toBe(3);
    expect(retry_logs[0].retry_count).toBe(1);
    expect(retry_logs[0].next_retry_delay_ms).toBe(1000);
    expect(retry_logs[1].retry_count).toBe(2);
    expect(retry_logs[1].next_retry_delay_ms).toBe(2000);
    expect(retry_logs[2].retry_count).toBe(3);
    expect(retry_logs[2].next_retry_delay_ms).toBe(4000);

    // (2) 再試行後も失敗した場合、内部の推奨パターンマスタから統計的に上位の成功パターン（例：顧客業種『IT』×案件規模『large』の過去成功事例トップ3）が返却
    expect(result.patterns).toBeDefined();
    expect(result.patterns.length).toBe(3);
    expect(result.patterns[0].pattern_id).toBe('P001');
    expect(result.patterns[0].customer_industry).toBe('IT');
    expect(result.patterns[0].deal_size).toBe('large');
    expect(result.patterns[0].success_count).toBe(45);
    expect(result.patterns[0].approach).toBe('デジタル化推進提案');
    expect(result.patterns[1].pattern_id).toBe('P002');
    expect(result.patterns[1].success_count).toBe(38);
    expect(result.patterns[2].pattern_id).toBe('P003');
    expect(result.patterns[2].success_count).toBe(32);

    // (3) 根拠説明は簡略版
    expect(result.reasoning_summary).toBe('過去成功パターンマスタから自動抽出');

    // (4) 利用者向けメッセージ『推奨の生成に一時的な遅延が発生しています。過去の推奨履歴から類似案件を表示します』が出力
    expect(result.user_message).toBe(
      '推奨の生成に一時的な遅延が発生しています。過去の推奨履歴から類似案件を表示します'
    );

    // (5) システムエラーログに『OpenAI API 404エラー発生、代替パターンマスタからの推奨に切り替え』と記録
    const error_log = system_logs.find((log) =>
      log.message.includes('OpenAI API') &&
      log.message.includes('404') &&
      log.message.includes('代替')
    );
    expect(error_log).toBeDefined();
    expect(error_log?.message).toMatch(/OpenAI API.*404.*代替パターンマスタ/);
    expect(error_log?.level).toBe('error');

    // API が3回呼ばれたことを確認
    expect(mock_openai_api).toHaveBeenCalledTimes(3);

    // フォールバックエンジンが1回呼ばれたことを確認
    expect(mock_fallback_engine).toHaveBeenCalledTimes(1);

    // ソースが fallback_master であることを確認
    expect(result.source).toBe('fallback_master');

    // フォールバック理由が記録されていることを確認
    expect(result.fallback_reason).toBe('404 Not Found');
  });
});