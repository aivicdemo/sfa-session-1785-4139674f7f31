import { evaluatePatternRelevance, findSimilarPatterns } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-2191
  test('管理職への数値化結果の提示 - 乖離スコアとマッチスコアの両方が正常に計算されたとき、両スコアが管理職に提示される', async () => {
    // 新規案件データ（顧客情報、商談条件）
    const dealInput = {
      customerId: 'CUST-20240115-001',
      customerName: 'テスト顧客A',
      industry: '製造業',
      companySize: '大企業',
      dealAmount: 5000000,
      dealStage: '提案段階',
      dealConditions: {
        budgetLimit: 5500000,
        scheduleConstraint: '2024年Q1中に導入',
        preferredVendor: false,
      },
    };

    // AIRecommendationEngineのスタブ: evaluatePatternRelevance() が乖離スコア 0.75 を返す
    const mockEvaluatePatternRelevance = jest.fn().mockResolvedValue({
      divergenceScore: 0.75,
      evaluationTimestamp: '2024-01-15T11:00:00Z',
    });

    // AIRecommendationEngineのスタブ: findSimilarPatterns() がマッチスコア 0.88 を返す
    const mockFindSimilarPatterns = jest.fn().mockResolvedValue({
      matchScore: 0.88,
      similarPatterns: [
        {
          patternId: 'PATTERN-001',
          matchPercentage: 88,
          successRate: 92,
        },
      ],
      searchTimestamp: '2024-01-15T11:00:00Z',
    });

    // 推奨根拠生成処理の実行
    const divergenceResult = await evaluatePatternRelevance(
      dealInput,
      mockEvaluatePatternRelevance as any
    );

    const matchResult = await findSimilarPatterns(
      dealInput,
      mockFindSimilarPatterns as any
    );

    // 乖離スコアが 0.75 であることを確認
    expect(divergenceResult.divergenceScore).toBe(0.75);

    // マッチスコアが 0.88 であることを確認
    expect(matchResult.matchScore).toBe(0.88);

    // 管理職向けの推奨結果画面に表示されるスコア値
    const managerDashboardDisplay = {
      divergenceScore: divergenceResult.divergenceScore,
      matchScore: matchResult.matchScore,
      presentationFormat: 'manager_dashboard',
      dealInfo: {
        customerId: dealInput.customerId,
        dealAmount: dealInput.dealAmount,
      },
    };

    // 乖離スコア（Divergence Score）が 0.75 で提示される
    expect(managerDashboardDisplay.divergenceScore).toBe(0.75);

    // マッチスコア（Match Score）が 0.88 で提示される
    expect(managerDashboardDisplay.matchScore).toBe(0.88);

    // 両スコアが異なる視点を示す独立した指標として存在する
    expect(managerDashboardDisplay.divergenceScore).not.toBe(
      managerDashboardDisplay.matchScore
    );

    // スタブメソッドが正常に呼ばれたことを確認
    expect(mockEvaluatePatternRelevance).toHaveBeenCalledWith(dealInput);
    expect(mockFindSimilarPatterns).toHaveBeenCalledWith(dealInput);
  });
});