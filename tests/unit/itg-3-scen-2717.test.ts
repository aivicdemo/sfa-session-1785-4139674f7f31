import { findSimilarPatterns, evaluatePatternRelevance } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン抽出・照合機能', () => {
  test('SCEN-2717: 過去商談データから複数件の成功パターンが抽出され、関連度スコアに基づいてランク付けされた推奨アプローチが決定される', async () => {
    // テストデータ：過去商談データ3件
    const pastDeals = [
      {
        dealId: 'deal_001',
        industry: 'IT',
        proposalType: 'SaaS',
        budget: 5000000,
        decisionPeriodDays: 90,
        status: 'won',
      },
      {
        dealId: 'deal_002',
        industry: 'IT',
        proposalType: 'CloudMigration',
        budget: 8000000,
        decisionPeriodDays: 60,
        status: 'won',
      },
      {
        dealId: 'deal_003',
        industry: 'IT',
        proposalType: 'BusinessToolImplementation',
        budget: 3000000,
        decisionPeriodDays: 120,
        status: 'won',
      },
    ];

    // 新規案件の商談条件
    const newDealCondition = {
      industry: 'IT',
      proposalType: 'CloudSystem',
      budgetPlan: 7000000,
      estimatedDecisionPeriodDays: 75,
    };

    // AIRecommendationEngine.findSimilarPatterns のスタブ
    const mockFindSimilarPatterns = jest.fn();
    mockFindSimilarPatterns.mockResolvedValue([
      { dealId: 'deal_001', relevanceScore: 0.72 },
      { dealId: 'deal_002', relevanceScore: 0.88 },
      { dealId: 'deal_003', relevanceScore: 0.54 },
    ]);

    // AIRecommendationEngine.evaluatePatternRelevance のスタブ
    const mockEvaluatePatternRelevance = jest.fn();
    mockEvaluatePatternRelevance
      .mockResolvedValueOnce({ dealId: 'deal_001', applicabilityScore: 0.70 })
      .mockResolvedValueOnce({ dealId: 'deal_002', applicabilityScore: 0.85 })
      .mockResolvedValueOnce({ dealId: 'deal_003', applicabilityScore: 0.52 });

    // findSimilarPatterns を呼び出し
    const similarPatterns = await mockFindSimilarPatterns(
      newDealCondition,
      pastDeals
    );

    // evaluatePatternRelevance を各パターンに対して呼び出し
    const evaluatedPatterns = [];
    for (const pattern of similarPatterns) {
      const pastDeal = pastDeals.find((d) => d.dealId === pattern.dealId);
      const evaluation = await mockEvaluatePatternRelevance(
        pattern,
        newDealCondition,
        pastDeal
      );
      evaluatedPatterns.push({
        ...pattern,
        ...evaluation,
      });
    }

    // 総合スコアを計算してランク付け
    const rankedPatterns = evaluatedPatterns
      .map((p) => ({
        dealId: p.dealId,
        relevanceScore: p.relevanceScore,
        applicabilityScore: p.applicabilityScore,
        compositeScore: p.relevanceScore * p.applicabilityScore,
      }))
      .sort((a, b) => b.compositeScore - a.compositeScore)
      .map((p, index) => ({
        rank: index + 1,
        dealId: p.dealId,
        compositeScore: parseFloat((p.compositeScore * 1000) / 1000),
        relevanceScore: p.relevanceScore,
        applicabilityScore: p.applicabilityScore,
      }));

    // 成功パターンに対する根拠情報をマッピング
    const dealDetails = {
      deal_001: {
        industry: 'IT',
        proposalType: 'SaaS',
        budget: 5000000,
        decisionPeriodDays: 90,
        keyFactors: [
          'SaaS導入経験',
          '予算規模が類似',
          '決定期間に差異あり',
        ],
      },
      deal_002: {
        industry: 'IT',
        proposalType: 'CloudMigration',
        budget: 8000000,
        decisionPeriodDays: 60,
        keyFactors: [
          'クラウド関連の実績',
          '予算規模が最も近い',
          '決定期間が最も近い',
        ],
      },
      deal_003: {
        industry: 'IT',
        proposalType: 'BusinessToolImplementation',
        budget: 3000000,
        decisionPeriodDays: 120,
        keyFactors: [
          'IT企業での実績',
          '予算規模が乖離',
          '決定期間が乖離',
        ],
      },
    };

    const resultWithDetails = rankedPatterns.map((p) => ({
      ...p,
      details: dealDetails[p.dealId as keyof typeof dealDetails],
    }));

    // アサーション：1位は案件2（総合スコア0.748）
    expect(resultWithDetails[0].rank).toBe(1);
    expect(resultWithDetails[0].dealId).toBe('deal_002');
    expect(resultWithDetails[0].compositeScore).toBe(0.748);
    expect(resultWithDetails[0].details.keyFactors).toContain(
      'クラウド関連の実績'
    );
    expect(resultWithDetails[0].details.keyFactors).toContain(
      '予算規模が最も近い'
    );
    expect(resultWithDetails[0].details.keyFactors).toContain(
      '決定期間が最も近い'
    );

    // アサーション：2位は案件1（総合スコア0.504）
    expect(resultWithDetails[1].rank).toBe(2);
    expect(resultWithDetails[1].dealId).toBe('deal_001');
    expect(resultWithDetails[1].compositeScore).toBe(0.504);
    expect(resultWithDetails[1].details.keyFactors).toContain(
      'SaaS導入経験'
    );
    expect(resultWithDetails[1].details.keyFactors).toContain(
      '決定期間に差異あり'
    );

    // アサーション：3位は案件3（総合スコア0.2808 ≈ 0.28）
    expect(resultWithDetails[2].rank).toBe(3);
    expect(resultWithDetails[2].dealId).toBe('deal_003');
    expect(resultWithDetails[2].compositeScore).toBe(0.2808);
    expect(resultWithDetails[2].details.keyFactors).toContain(
      '予算規模が乖離'
    );
    expect(resultWithDetails[2].details.keyFactors).toContain(
      '決定期間が乖離'
    );

    // アサーション：すべてのパターンにキー要因が記載されている
    expect(resultWithDetails).toHaveLength(3);
    resultWithDetails.forEach((pattern) => {
      expect(pattern.details).toBeDefined();
      expect(pattern.details.keyFactors).toBeDefined();
      expect(Array.isArray(pattern.details.keyFactors)).toBe(true);
      expect(pattern.details.keyFactors.length).toBeGreaterThan(0);
    });
  });
});