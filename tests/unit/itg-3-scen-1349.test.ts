import { explainRecommendationReasoning } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-1349
  test('[normal] 推奨根拠の可視化と説明文生成機能 - OpenAI APIが失敗したとき、簡略版の根拠説明が返される', async () => {
    // Arrange: OpenAI API呼び出し失敗を模擬するスタブ
    let attemptCount = 0;
    const failingAIEngine = {
      explainRecommendationReasoning: jest.fn(async () => {
        attemptCount++;
        if (attemptCount <= 3) {
          // 最大3回の指数バックオフ再試行をシミュレート
          const backoffDelays = [1000, 2000, 4000];
          await new Promise(resolve =>
            setTimeout(resolve, backoffDelays[attemptCount - 1])
          );
          throw new Error('OpenAI API timeout or network error');
        }
        throw new Error('Max retries exceeded');
      }),
    };

    // 推奨パターンマスタから統計的に上位の成功パターンを返すスタブ
    const recommendationPatternMaster = [
      {
        patternId: 'pattern_001',
        patternName: '新規顧客向け標準提案',
        successRate: 0.85,
        description: '成功パターン：新規顧客向け標準提案 適用理由：顧客業種・規模の基準合致',
      },
      {
        patternId: 'pattern_002',
        patternName: '既存顧客向けアップセル提案',
        successRate: 0.72,
        description: '成功パターン：既存顧客向けアップセル提案 適用理由：購買履歴との合致',
      },
      {
        patternId: 'pattern_003',
        patternName: '競争案件対抗提案',
        successRate: 0.65,
        description: '成功パターン：競争案件対抗提案 適用理由：市場競争環境への適応',
      },
    ];

    const newDealData = {
      customerId: 'cust_12345',
      customerIndustry: 'manufacturing',
      customerSize: 'enterprise',
      dealCondition: 'new_deal',
      proposalContent: 'digital_transformation_solution',
      salesStageAtRecommendation: 'initial_contact',
    };

    const mockFileStorageAdapter = {
      uploadRecommendationReport: jest.fn(),
      generateDownloadUrl: jest.fn(),
      deleteExpiredReports: jest.fn(),
    };

    // Act: 推奨根拠説明の生成を実行
    const result = await explainRecommendationReasoning(
      newDealData,
      failingAIEngine,
      recommendationPatternMaster,
      mockFileStorageAdapter
    );

    // Assert: OpenAI APIの失敗が検出され、代替動作へ切り替わったことを検証
    expect(attemptCount).toBe(3); // 3回の指数バックオフ再試行が実行された
    expect(result.status).toBe('fallback_active');
    expect(result.userMessage).toBe(
      '推奨の生成に一時的な遅延が発生しています。過去の推奨履歴から類似案件を表示します'
    );

    // 返却された推奨根拠が簡略版であることを検証
    expect(result.recommendationReasoning).toBeDefined();
    expect(result.recommendationReasoning.pattern).toBe('pattern_001'); // 統計的に上位パターン
    expect(result.recommendationReasoning.explanation).toContain('成功パターン：');
    expect(result.recommendationReasoning.explanation).toContain('適用理由：');

    // 簡略版は通常版より字数が少ないことを検証（具体値）
    const abbreviatedLength = result.recommendationReasoning.explanation.length;
    expect(abbreviatedLength).toBeLessThanOrEqual(150); // 簡略版の文字数上限

    // 統計的に上位の成功パターンが選択されたことを検証
    const selectedPattern = recommendationPatternMaster.find(
      p => p.patternId === result.recommendationReasoning.pattern
    );
    expect(selectedPattern).toBeDefined();
    expect(selectedPattern?.successRate).toBe(0.85); // 最も成功率が高いパターン

    // システムログに再試行とAPI失敗、代替動作への切り替え記録が残っていることを検証
    expect(result.systemLog).toBeDefined();
    expect(result.systemLog.retryAttempts).toBe(3);
    expect(result.systemLog.apiCallStatus).toBe('failed');
    expect(result.systemLog.fallbackTriggered).toBe(true);
    expect(result.systemLog.backoffSequence).toEqual([1000, 2000, 4000]);
  });
});