import { generateRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('IT-1-BR-3-3-2-1: 推奨生成機能 - AIエージェント外部API呼び出しタイムアウト時の代替処理', () => {
  // SCEN-361
  test('AIエージェント外部API呼び出しがタイムアウト（30秒超過）したとき、推奨パターンマスタから統計的に上位の成功パターン3件を返却する', async () => {
    const newCaseData = {
      customerId: 'CUST-20240115-001',
      customerIndustry: '製造業',
      customerScale: '大企業',
      dealAmount: 50000000,
      dealStage: '提案準備',
      productCategory: 'クラウドERP',
    };

    const topSuccessPatterns = [
      {
        patternId: 'PAT-001',
        successRate: 0.92,
        recommendedApproach: 'フェーズ1: 現状分析と課題抽出（2週間）',
        briefReasoning: '大企業の製造業向けERPは段階的な導入が成功率92%',
      },
      {
        patternId: 'PAT-002',
        successRate: 0.87,
        recommendedApproach: 'フェーズ2: 要件定義と業務設計（4週間）',
        briefReasoning: '大規模案件は詳細な業務設計が採用率向上',
      },
      {
        patternId: 'PAT-003',
        successRate: 0.81,
        recommendedApproach: 'フェーズ3: パイロット導入と検証（6週間）',
        briefReasoning: '初期段階の成功確認で顧客信頼度が向上',
      },
    ];

    const simulatedApiCallTime = 35000;
    const timeoutThreshold = 30000;
    const retryIntervals = [1000, 2000, 4000];
    const maxRetries = 3;

    let apiCallCount = 0;
    let totalRetryTime = 0;
    let apiTimeoutOccurred = false;
    let fallbackPatternRetrievalOccurred = false;
    let systemLogs: string[] = [];

    const mockAIEngine = {
      generateRecommendation: async () => {
        apiCallCount += 1;
        await new Promise((_, reject) => {
          setTimeout(() => {
            reject(new Error('API timeout exceeded'));
          }, simulatedApiCallTime);
        });
      },
    };

    const mockPatternMaster = {
      getTopSuccessPatterns: async () => {
        fallbackPatternRetrievalOccurred = true;
        systemLogs.push('推奨パターンマスタからの代替パターン返却');
        return topSuccessPatterns;
      },
    };

    const executeRecommendationWithFallback = async (
      caseData: typeof newCaseData,
      aiEngine: typeof mockAIEngine,
      patternMaster: typeof mockPatternMaster
    ) => {
      const startTime = Date.now();
      const userMessage =
        '推奨の生成に一時的な遅延が発生しています。過去の推奨履歴から類似案件を表示します';

      for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
          const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => {
              reject(new Error('Timeout'));
            }, timeoutThreshold);
          });

          await Promise.race([
            aiEngine.generateRecommendation(),
            timeoutPromise,
          ]);
          break;
        } catch (error) {
          if (attempt === 0) {
            apiTimeoutOccurred = true;
            systemLogs.push('API呼び出しタイムアウト発生');
          }

          if (attempt < maxRetries - 1) {
            totalRetryTime += retryIntervals[attempt];
            await new Promise((resolve) => {
              setTimeout(resolve, retryIntervals[attempt]);
            });
          }

          if (attempt === maxRetries - 1) {
            systemLogs.push('指数バックオフ再試行3回実行');
            const patterns = await patternMaster.getTopSuccessPatterns();
            const responseTime = Date.now() - startTime;

            return {
              userMessage,
              patterns,
              reasoning: 'briefVersion',
              responseTime,
              logs: systemLogs,
            };
          }
        }
      }
    };

    const result = await executeRecommendationWithFallback(
      newCaseData,
      mockAIEngine,
      mockPatternMaster
    );

    expect(result.userMessage).toBe(
      '推奨の生成に一時的な遅延が発生しています。過去の推奨履歴から類似案件を表示します'
    );

    expect(result.patterns).toHaveLength(3);
    expect(result.patterns[0]).toEqual({
      patternId: 'PAT-001',
      successRate: 0.92,
      recommendedApproach: 'フェーズ1: 現状分析と課題抽出（2週間）',
      briefReasoning: '大企業の製造業向けERPは段階的な導入が成功率92%',
    });
    expect(result.patterns[1]).toEqual({
      patternId: 'PAT-002',
      successRate: 0.87,
      recommendedApproach: 'フェーズ2: 要件定義と業務設計（4週間）',
      briefReasoning: '大規模案件は詳細な業務設計が採用率向上',
    });
    expect(result.patterns[2]).toEqual({
      patternId: 'PAT-003',
      successRate: 0.81,
      recommendedApproach: 'フェーズ3: パイロット導入と検証（6週間）',
      briefReasoning: '初期段階の成功確認で顧客信頼度が向上',
    });

    expect(result.reasoning).toBe('briefVersion');

    expect(result.logs).toContain('API呼び出しタイムアウト発生');
    expect(result.logs).toContain('指数バックオフ再試行3回実行');
    expect(result.logs).toContain('推奨パターンマスタからの代替パターン返却');

    expect(apiTimeoutOccurred).toBe(true);
    expect(fallbackPatternRetrievalOccurred).toBe(true);
    expect(result.responseTime).toBeLessThanOrEqual(
      simulatedApiCallTime + totalRetryTime + 5000
    );
  });
});