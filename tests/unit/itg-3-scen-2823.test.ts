import { extractSuccessPatterns } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン抽出・重み付けロジック - 月末を跨ぐ期間の集計分割', () => {
  // SCEN-2823
  test('月末を跨ぐ商談データが期間区分によって正確に分割され、各期間の重み付けスコアが独立して計算される', async () => {
    // テストデータ準備: 月末を跨ぐ商談データ（2024年1月28日～2月3日）
    const dealsCrossingMonthEnd = [
      {
        customerId: 'CUST-001',
        dealAmount: 500000,
        successFlag: true,
        dealStage: 'closed',
        startDate: new Date('2024-01-28T09:00:00Z'),
        endDate: new Date('2024-01-31T18:00:00Z'),
      },
      {
        customerId: 'CUST-002',
        dealAmount: 300000,
        successFlag: true,
        dealStage: 'closed',
        startDate: new Date('2024-02-01T10:00:00Z'),
        endDate: new Date('2024-02-03T17:00:00Z'),
      },
    ];

    // AIRecommendationEngineのスタブ
    const mockAIEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        approach: 'pattern-based-proposal',
        confidenceScore: 85,
      }),
      findSimilarPatterns: jest.fn().mockResolvedValue([
        {
          patternId: 'PAT-JAN-001',
          period: 'january',
          matchScore: 0.92,
        },
        {
          patternId: 'PAT-FEB-001',
          period: 'february',
          matchScore: 0.88,
        },
      ]),
      explainRecommendationReasoning: jest.fn().mockResolvedValue({
        reasoning: 'Based on historical success patterns',
      }),
      evaluatePatternRelevance: jest.fn().mockResolvedValue({
        relevanceScore: 82,
      }),
    };

    // 成功パターン抽出・重み付けロジックを実行
    const result = await extractSuccessPatterns(dealsCrossingMonthEnd, mockAIEngine);

    // 期待結果1: 月末を跨ぐデータが正確に2つの期間グループに分割されている
    expect(result.periodGroups).toHaveLength(2);

    // 期待結果2: 1月分集計（1月28日～31日）の集計値が正確に計算される
    const januaryGroup = result.periodGroups.find(
      (group) => group.period === 'january'
    );
    expect(januaryGroup).toBeDefined();
    expect(januaryGroup?.startDate).toEqual(new Date('2024-01-28T09:00:00Z'));
    expect(januaryGroup?.endDate).toEqual(new Date('2024-01-31T18:00:00Z'));
    expect(januaryGroup?.successfulDealsCount).toBe(1);
    expect(januaryGroup?.totalAmount).toBe(500000);
    expect(januaryGroup?.successRate).toBe(100);

    // 期待結果3: 2月分集計（2月1日～3日）の集計値が正確に計算される
    const februaryGroup = result.periodGroups.find(
      (group) => group.period === 'february'
    );
    expect(februaryGroup).toBeDefined();
    expect(februaryGroup?.startDate).toEqual(new Date('2024-02-01T10:00:00Z'));
    expect(februaryGroup?.endDate).toEqual(new Date('2024-02-03T17:00:00Z'));
    expect(februaryGroup?.successfulDealsCount).toBe(1);
    expect(februaryGroup?.totalAmount).toBe(300000);
    expect(februaryGroup?.successRate).toBe(100);

    // 期待結果4: 各期間ごとに独立した重み付けスコアが計算される
    expect(januaryGroup?.weightedScore).toBe(92); // 1月分の重み付けスコア
    expect(februaryGroup?.weightedScore).toBe(88); // 2月分の重み付けスコア

    // 期待結果5: 分割された期間ごとの成功パターン抽出がAIエンジンで呼び出されている
    expect(mockAIEngine.findSimilarPatterns).toHaveBeenCalledTimes(2);
    expect(mockAIEngine.findSimilarPatterns).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        period: 'january',
        deals: [dealsCrossingMonthEnd[0]],
      })
    );
    expect(mockAIEngine.findSimilarPatterns).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        period: 'february',
        deals: [dealsCrossingMonthEnd[1]],
      })
    );

    // 期待結果6: 月をまたぐデータが混在または重複していない
    const allDealsInGroups = [
      ...januaryGroup!.deals,
      ...februaryGroup!.deals,
    ];
    expect(allDealsInGroups).toHaveLength(2);
    expect(allDealsInGroups[0].customerId).toBe('CUST-001');
    expect(allDealsInGroups[1].customerId).toBe('CUST-002');

    // 期待結果7: 最終的な推奨結果が期間別の統計情報を正確に反映している
    expect(result.recommendations).toBeDefined();
    expect(result.recommendations.januaryWeightedApproach).toBe(
      'pattern-based-proposal'
    );
    expect(result.recommendations.februaryWeightedApproach).toBe(
      'pattern-based-proposal'
    );
    expect(result.recommendations.aggregatedConfidenceScore).toBe(85);
  });
});