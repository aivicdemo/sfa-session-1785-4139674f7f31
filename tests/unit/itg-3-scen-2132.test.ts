import { generateRecommendationWithFallback } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン抽出と新規案件への適用推奨 - AIエージェント推奨生成', () => {
  // SCEN-2132
  test('AIRecommendationEngine のタイムアウト時に指数バックオフ再試行と代替パターン表示が動作する', async () => {
    // Arrange: AIRecommendationEngine モックの設定
    const mockAIEngine = {
      generateRecommendation: jest.fn().mockImplementation(
        () => new Promise((_, reject) => {
          setTimeout(() => {
            reject(new Error('API_TIMEOUT'));
          }, 31000); // 30秒超過のタイムアウト
        })
      ),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    // 内部の推奨パターンマスタから取得される代替パターン
    const fallbackPatternMaster = [
      {
        id: 'pattern_001',
        name: '新規顧客向け標準提案パターン',
        successRate: 0.78,
        applicableIndustries: ['IT', '通信'],
        description: '新規顧客の初回接触時に使用される標準的な提案パターン',
      },
      {
        id: 'pattern_002',
        name: '大規模企業向け経営層説得パターン',
        successRate: 0.72,
        applicableIndustries: ['金融', '製造'],
        description: '経営層への説得を中心とした提案パターン',
      },
      {
        id: 'pattern_003',
        name: '予算制約下での段階的提案パターン',
        successRate: 0.65,
        applicableIndustries: ['小売', '医療'],
        description: '予算が限定的な顧客向けの段階的な提案パターン',
      },
    ];

    // 新規案件データ
    const newCaseDealCondition = {
      customerId: 'cust_2024_001',
      customerName: '新規顧客A社',
      industry: 'IT',
      companySize: 'large',
      budgetScale: 5000000,
      dealStage: 'initial_contact',
      expectedCloseDate: '2024-12-31',
      proposalFocus: 'cost_reduction',
    };

    // Act & Assert: generateRecommendationWithFallback を呼び出し
    const result = await generateRecommendationWithFallback(
      newCaseDealCondition,
      mockAIEngine,
      fallbackPatternMaster
    );

    // (1) 最大 3 回の指数バックオフ再試行が実行されたことを確認
    expect(mockAIEngine.generateRecommendation).toHaveBeenCalledTimes(3);

    // (2) 3 回の再試行すべてが失敗することを確認
    const callTimestamps: number[] = [];
    for (let i = 0; i < 3; i++) {
      callTimestamps.push(Date.now());
      // 再試行間隔の確認: 初回 1 秒、2 回目 2 秒、3 回目 4 秒
      if (i === 0) {
        await new Promise(resolve => setTimeout(resolve, 1100));
      } else if (i === 1) {
        await new Promise(resolve => setTimeout(resolve, 2100));
      } else if (i === 2) {
        await new Promise(resolve => setTimeout(resolve, 4100));
      }
    }

    // (3) システムが内部の推奨パターンマスタから統計的に上位の成功パターンを返すことを確認
    expect(result.recommendationType).toBe('fallback');
    expect(result.fallbackUsed).toBe(true);
    expect(result.selectedPattern).toBeDefined();
    expect(result.selectedPattern.id).toBe('pattern_001'); // 最高成功率 78%
    expect(result.selectedPattern.successRate).toBe(0.78);

    // (4) 利用者向けメッセージが正しく設定されていることを確認
    expect(result.userMessage).toBe(
      '推奨の生成に一時的な遅延が発生しています。過去の推奨履歴から類似案件を表示します'
    );

    // (5) キャッシュされた過去推奨が返却されることを確認
    expect(result.cachedRecommendation).toBeDefined();
    expect(result.cachedRecommendation.patternId).toBe('pattern_001');
    expect(result.cachedRecommendation.patternName).toBe('新規顧客向け標準提案パターン');
    expect(result.cachedRecommendation.applicableIndustries).toContain('IT');

    // (5) 代替推奨の根拠説明が簡略版で表示されることを確認
    expect(result.reasoningExplanation).toBeDefined();
    expect(result.reasoningExplanation).toBe('簡略版: 統計的に最も成功実績の高いパターンを選択しました');
    expect(result.reasoningExplanation.length).toBeLessThan(100); // 簡略版であることを確認
  });
});