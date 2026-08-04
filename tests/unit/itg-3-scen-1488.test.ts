import { evaluateRecommendationReasoning } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェント推奨根拠の可視化 - 外部API呼び出しタイムアウト処理', () => {
  test('SCEN-1488: AIRecommendationEngineへの呼び出しがタイムアウト（30秒超過）するときエラーを返す', async () => {
    // 準備: タイムアウトをシミュレートするスタブの定義
    const timeoutDelayMs = 31000; // 30秒以上の遅延
    let attemptCount = 0;
    
    const aiEngineStub = {
      generateRecommendation: jest.fn(
        () => new Promise((_, reject) => {
          attemptCount++;
          setTimeout(() => {
            reject(new Error('Request timeout after 30000ms'));
          }, timeoutDelayMs);
        })
      ),
      findSimilarPatterns: jest.fn(() => Promise.resolve([
        {
          patternId: 'PAT001',
          matchScore: 0.92,
          description: '成功パターン: 業種IT、規模100-500名、提案額500万円'
        },
        {
          patternId: 'PAT002',
          matchScore: 0.85,
          description: '成功パターン: 業種製造、規模50-200名、提案額300万円'
        }
      ])),
      explainRecommendationReasoning: jest.fn(() => Promise.resolve(
        '過去の類似案件（マッチスコア: 92%）から推奨されたアプローチです。同業種・規模の顧客で80%以上の成約率を記録しています。'
      )),
      evaluatePatternRelevance: jest.fn(() => Promise.resolve({ relevanceScore: 0.88 }))
    };

    // 内部推奨パターンマスタの代替データ（キャッシュ）
    const cachedRecommendationMaster = [
      {
        rankId: 1,
        approachName: '経営層への直接プレゼンテーション',
        successRate: 0.78,
        usageCount: 245,
        simplifiedReasoning: '経営層の意思決定を加速させる標準パターン'
      },
      {
        rankId: 2,
        approachName: 'ROI分析資料の事前送付',
        successRate: 0.72,
        usageCount: 189,
        simplifiedReasoning: '予算承認プロセスの簡素化を促進'
      },
      {
        rankId: 3,
        approachName: 'パイロット導入プランの提案',
        successRate: 0.68,
        usageCount: 156,
        simplifiedReasoning: 'リスク軽減と段階的展開を実現'
      }
    ];

    // 入力: 商談条件データ
    const dealCondition = {
      customerId: 'CUST12345',
      customerName: '株式会社テクノロジー',
      industry: 'IT',
      employeeCount: 250,
      proposalAmount: 5000000,
      dealStage: 'negotiation'
    };

    // 実行: 推奨根拠可視化機能にタイムアウト処理を含めた呼び出し
    const result = await evaluateRecommendationReasoning(
      dealCondition,
      aiEngineStub
    );

    // 検証1: タイムアウト後のエラーハンドリングが正常に機能することを確認
    expect(result).toBeDefined();
    expect(result.status).toBe('timeout_handled');
    
    // 検証2: ユーザーへの表示メッセージが期待値どおりであることを確認
    expect(result.userMessage).toBe(
      '推奨の生成に一時的な遅延が発生しています。過去の推奨履歴から類似案件を表示します'
    );

    // 検証3: キャッシュされた過去推奨が代替表示されることを確認
    expect(result.fallbackRecommendations).toBeDefined();
    expect(result.fallbackRecommendations.length).toBe(3);
    expect(result.fallbackRecommendations[0]).toEqual({
      rankId: 1,
      approachName: '経営層への直接プレゼンテーション',
      successRate: 0.78,
      usageCount: 245,
      simplifiedReasoning: '経営層の意思決定を加速させる標準パターン'
    });
    expect(result.fallbackRecommendations[1]).toEqual({
      rankId: 2,
      approachName: 'ROI分析資料の事前送付',
      successRate: 0.72,
      usageCount: 189,
      simplifiedReasoning: '予算承認プロセスの簡素化を促進'
    });

    // 検証4: 簡略版の根拠説明が表示されることを確認
    expect(result.simplifiedReasoning).toBe(
      '統計的に上位の成功パターンから推奨されました。詳細な根拠分析は完了後に表示予定です。'
    );

    // 検証5: 最大3回の指数バックオフ再試行が実行されたことを確認
    // 初回1秒、2回目2秒、3回目4秒で合計7秒の再試行が行われ、
    // その後も応答がない場合は最終的にエラーレスポンスが返却される
    expect(result.retryAttempts).toBe(3);
    expect(result.retryDelays).toEqual([1000, 2000, 4000]);

    // 検証6: APIエンジンへの呼び出し回数が期待値（3回の再試行）を確認
    expect(aiEngineStub.generateRecommendation).toHaveBeenCalledTimes(3);

    // 検証7: 最終的なエラーレスポンスの形式を確認
    expect(result.error).toBeDefined();
    expect(result.error).toMatch(/タイムアウト|timeout/i);

    // 検証8: 内部推奨パターンマスタからの統計的上位成功パターンが返却されたことを確認
    expect(result.topSuccessPatterns).toBeDefined();
    expect(result.topSuccessPatterns.length).toBeGreaterThan(0);
    expect(result.topSuccessPatterns[0].successRate).toBeGreaterThanOrEqual(
      result.topSuccessPatterns[1]?.successRate ?? 0
    );

    // 検証9: キャッシュ利用フラグが真であることを確認
    expect(result.usedCache).toBe(true);

    // 検証10: システムが正常に復帰し、他の処理への影響がないことを確認
    expect(result.systemHealth).toBe('recovered');
  });
});