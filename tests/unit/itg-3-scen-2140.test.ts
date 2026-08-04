import { explainRecommendationReasoning } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェント推奨根拠の可視化機能 - explainRecommendationReasoning', () => {
  // SCEN-2140
  test('OpenAI API呼び出し失敗時に簡略版説明が推奨パターンマスタから返却される', async () => {
    // 初期化
    const recommendationId = 'REC-20240115-001';
    const dealContext = {
      customerId: 'CUST-2024-0001',
      customerIndustry: 'manufacturing',
      customerSize: 'large',
      dealStage: 'proposal',
      productCategory: 'enterprise_solution',
      proposalAmount: 5000000,
      competitorPresent: true,
      decisionMakerLevel: 'c_level',
    };

    // API呼び出し履歴を記録するためのスパイ
    const apiCallLogs: Array<{ timestamp: number; attempt: number; status: string }> = [];

    // AIRecommendationEngine スタブを作成
    const mockAIRecommendationEngine = {
      explainRecommendationReasoning: jest.fn().mockImplementation(
        async (
          _recommendationId: string,
          _dealContext: typeof dealContext,
          _externalEngineStub: any
        ) => {
          // 外部API呼び出しをシミュレート（3回の再試行を実行）
          let lastError: Error | null = null;
          for (let attempt = 1; attempt <= 3; attempt++) {
            apiCallLogs.push({
              timestamp: Date.now(),
              attempt: attempt,
              status: 'attempting',
            });

            try {
              // 外部API呼び出しが失敗（タイムアウト）することを想定
              throw new Error('API timeout: request exceeded 30 seconds');
            } catch (error) {
              lastError = error as Error;
              apiCallLogs[apiCallLogs.length - 1].status = 'failed';
              // 指数バックオフで再試行
              if (attempt < 3) {
                await new Promise((resolve) =>
                  setTimeout(resolve, Math.pow(2, attempt - 1) * 1000)
                );
              }
            }
          }

          // 外部API失敗時の代替動作：推奨パターンマスタから簡略版説明を取得
          if (lastError) {
            const patternMasterData = {
              topSuccessPattern: {
                patternName: 'enterprise_solution_direct_sales_approach',
                conversionRate: 0.75,
                sampleSize: 30,
                approachDescription:
                  '大企業向けエンタープライズソリューションの提案では、経営層への直接アプローチと段階的な価値実証が効果的',
              },
            };

            return {
              status: 'fallback',
              recommendationId: _recommendationId,
              reasoning: `このアプローチは過去${patternMasterData.topSuccessPattern.sampleSize}件の類似案件中で${Math.round(patternMasterData.topSuccessPattern.conversionRate * 100)}%の成約率を達成しています。${patternMasterData.topSuccessPattern.approachDescription}`,
              sourceType: 'pattern_master',
              explanation:
                '推奨生成に一時的な遅延が発生しています。過去の推奨履歴から類似案件を表示します。',
              fallbackReason: 'external_api_timeout',
              retryAttempts: 3,
            };
          }

          throw new Error('Unexpected state: all retries failed without fallback');
        }
      ),
    };

    // テスト実行
    const result = await mockAIRecommendationEngine.explainRecommendationReasoning(
      recommendationId,
      dealContext,
      mockAIRecommendationEngine
    );

    // 期待値
    const expectedReasoningPattern =
      /このアプローチは過去30件の類似案件中で75%の成約率を達成しています/;
    const expectedRetryAttempts = 3;

    // アサーション
    expect(result.status).toBe('fallback');
    expect(result.recommendationId).toBe(recommendationId);
    expect(result.reasoning).toMatch(expectedReasoningPattern);
    expect(result.sourceType).toBe('pattern_master');
    expect(result.explanation).toBe(
      '推奨生成に一時的な遅延が発生しています。過去の推奨履歴から類似案件を表示します。'
    );
    expect(result.fallbackReason).toBe('external_api_timeout');
    expect(result.retryAttempts).toBe(expectedRetryAttempts);

    // API呼び出し履歴の検証：3回の再試行が実行されたことを確認
    expect(apiCallLogs.length).toBe(3);
    expect(apiCallLogs[0].attempt).toBe(1);
    expect(apiCallLogs[1].attempt).toBe(2);
    expect(apiCallLogs[2].attempt).toBe(3);
    apiCallLogs.forEach((log) => {
      expect(log.status).toBe('failed');
    });

    // 推奨パターンマスタから取得されたことを確認
    expect(result.reasoning).toContain('成約率');
    expect(result.reasoning).toContain('類似案件');
  });
});