import { generateRecommendationWithFallback } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能 - OpenAI APIタイムアウト時のキャッシュ代替表示', () => {
  test('SCEN-273: OpenAI APIがタイムアウトしたとき、キャッシュされた過去推奨が代替表示される', async () => {
    // ========== Setup: タイムアウトをシミュレートするスタブ ==========
    const aiEngineStub = {
      generateRecommendation: jest.fn(async () => {
        return new Promise((_, reject) => {
          setTimeout(() => {
            reject(new Error('API request timeout after 30 seconds'));
          }, 31000); // 30秒超過をシミュレート
        });
      }),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    // ========== Setup: 推奨パターンマスタのデータ ==========
    const recommendationPatternMaster = [
      {
        pattern_id: 'PAT-001',
        case_id: 'CASE-001',
        customer_industry: 'IT',
        customer_size: 'large',
        proposed_approach: 'デジタル変革支援パッケージ',
        success_rate: 0.85,
        created_at: '2024-01-10T09:00:00Z',
        reasoning_summary: 'IT大手企業の過去成功事例から、DX支援が有効',
      },
    ];

    // ========== Setup: キャッシュストレージ ==========
    const cacheStorage = new Map<string, object>();
    cacheStorage.set('CASE-001', {
      approach: 'デジタル変革支援パッケージ',
      reasoning: 'IT大手企業の過去成功事例から、DX支援が有効',
      timestamp: '2024-01-10T09:00:00Z',
    });

    // ========== Setup: 新規案件の入力値 ==========
    const newCaseInput = {
      case_id: 'CASE-002',
      customer_name: '新規IT企業',
      customer_industry: 'IT',
      customer_size: 'large',
      key_challenge: 'クラウド移行の推進',
      budget_range: '5000万円～1億円',
    };

    // ========== Setup: 再試行ログを記録するためのスタブ ==========
    const retryLog: Array<{ attempt: number; wait_ms: number; timestamp: string }> = [];
    const originalDateNow = Date.now;
    let currentTime = new Date('2024-01-15T11:00:00Z').getTime();

    jest.spyOn(global, 'Date').mockImplementation((...args: any[]) => {
      if (args.length === 0) {
        const result = new originalDate(currentTime);
        return result;
      }
      return new originalDate(...args);
    });

    const mockSetTimeout = jest.fn((callback, delay) => {
      retryLog.push({
        attempt: retryLog.length + 1,
        wait_ms: delay,
        timestamp: new Date(currentTime).toISOString(),
      });
      currentTime += delay;
      callback();
      return retryLog.length;
    });

    jest.useFakeTimers();

    // ========== Execution ==========
    const result = await generateRecommendationWithFallback(
      newCaseInput,
      aiEngineStub,
      recommendationPatternMaster,
      cacheStorage,
      mockSetTimeout
    );

    // ========== Verification: 指数バックオフによる再試行の確認 ==========
    // 期待値: 1秒→2秒→4秒の待機（最大3回）
    expect(retryLog.length).toBe(3);
    expect(retryLog[0].wait_ms).toBe(1000);
    expect(retryLog[1].wait_ms).toBe(2000);
    expect(retryLog[2].wait_ms).toBe(4000);

    // ========== Verification: タイムアウトメッセージの確認 ==========
    expect(result.status).toBe('fallback_used');
    expect(result.message).toBe(
      '推奨の生成に一時的な遅延が発生しています。過去の推奨履歴から類似案件を表示します'
    );

    // ========== Verification: キャッシュから取得した過去推奨データの確認 ==========
    expect(result.recommended_approach).toBe('デジタル変革支援パッケージ');
    expect(result.reasoning_brief).toBe(
      'IT大手企業の過去成功事例から、DX支援が有効'
    );
    expect(result.timestamp).toBe('2024-01-10T09:00:00Z');

    // ========== Verification: 根拠説明が簡略版であることの確認 ==========
    expect(result.reasoning_brief.length).toBeLessThan(100);
    expect(result.hasOwnProperty('reasoning_brief')).toBe(true);
    expect(result.hasOwnProperty('reasoning_full')).toBe(false);

    // ========== Verification: 外部AI呼び出しが3回発生したことの確認 ==========
    expect(aiEngineStub.generateRecommendation).toHaveBeenCalledTimes(3);

    // ========== Verification: 推奨パターンマスタと内部キャッシュのみからデータ取得 ==========
    expect(result.source).toBe('cache_and_master');
    expect(result.pattern_id).toBe('PAT-001');
    expect(result.cached_data_used).toBe(true);

    jest.restoreAllMocks();
    jest.useRealTimers();
  });
});