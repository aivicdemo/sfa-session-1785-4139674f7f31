import { generateProposalApproach } from '../../src/logic/it-1-br-3-3-2-1';

describe('提案アプローチ生成機能 - AIエージェントタイムアウト時の代替表示', () => {
  // SCEN-1140
  test('AIRecommendationEngine呼び出しが30秒超のタイムアウトで失敗したとき、キャッシュされた過去推奨を代替表示する', () => {
    // Arrange: タイムアウト失敗するスタブ AIRecommendationEngine を構成
    const timeoutErrorMessage = 'API request timeout after 30 seconds';
    let retryCount = 0;
    const aiRecommendationEngineStub = {
      generateRecommendation: jest.fn(async () => {
        retryCount++;
        if (retryCount <= 3) {
          // 指数バックオフで遅延後、タイムアウトエラーをスロー
          await new Promise(resolve => {
            const delayMs = Math.pow(2, retryCount - 1) * 1000;
            setTimeout(resolve, delayMs);
          });
        }
        throw new Error(timeoutErrorMessage);
      }),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    // キャッシュされた過去推奨（推奨パターンマスタから抽出）
    const cachedRecommendations = [
      {
        pattern_id: 'PAT-001',
        approach_name: '顧客課題の段階的解決を示す段階的提案アプローチ',
        success_count: 42,
        confidence_score: 88,
        brief_rationale: '過去の類似案件で成功実績が高いパターン',
      },
      {
        pattern_id: 'PAT-002',
        approach_name: 'ROI中心の経営効果訴求型提案',
        success_count: 35,
        confidence_score: 82,
        brief_rationale: '中堅企業向けの採用実績が豊富',
      },
    ];

    const fileStorageAdapterStub = {
      uploadRecommendationReport: jest.fn(),
      generateDownloadUrl: jest.fn(),
      deleteExpiredReports: jest.fn(),
    };

    const cacheStub = {
      getCachedRecommendations: jest.fn().mockResolvedValue(cachedRecommendations),
    };

    // 新規案件の顧客情報
    const proposalInput = {
      customer_industry: 'IT',
      customer_scale: 'mid_market',
      customer_challenge: 'DX推進',
      sales_stage: 'initial_proposal',
      product_category: 'digital_transformation',
    };

    // Act: 提案アプローチ生成を実行
    const result = generateProposalApproach(
      proposalInput,
      aiRecommendationEngineStub,
      fileStorageAdapterStub,
      cacheStub,
    );

    // Assert: 結果を検証
    expect(result).toEqual({
      status: 'fallback_from_timeout',
      message: '推奨の生成に一時的な遅延が発生しています。過去の推奨履歴から類似案件を表示します',
      recommended_approach: {
        pattern_id: 'PAT-001',
        approach_name: '顧客課題の段階的解決を示す段階的提案アプローチ',
        confidence_score: 88,
        brief_rationale: '過去の類似案件で成功実績が高いパターン',
        is_simplified: true,
      },
      retry_attempts: 3,
      retry_delays_ms: [1000, 2000, 4000],
      original_error_code: 'TIMEOUT_30S_EXCEEDED',
    });

    // AIエージェント呼び出しが最大3回再試行されたことを確認
    expect(aiRecommendationEngineStub.generateRecommendation).toHaveBeenCalledTimes(3);

    // キャッシュから過去推奨が取得されたことを確認
    expect(cacheStub.getCachedRecommendations).toHaveBeenCalledWith(
      proposalInput.customer_industry,
      proposalInput.customer_challenge,
    );

    // 統計的に上位（success_count が最大）のパターンが選ばれたことを確認
    expect(result.recommended_approach.pattern_id).toBe('PAT-001');
    expect(result.recommended_approach.approach_name).toBe('顧客課題の段階的解決を示す段階的提案アプローチ');

    // 根拠説明が簡略版であることを確認
    expect(result.recommended_approach.is_simplified).toBe(true);
    expect(result.recommended_approach.brief_rationale).toBe('過去の類似案件で成功実績が高いパターン');
  });
});