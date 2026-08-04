import { evaluatePatternRelevance } from '../../src/logic/it-1-br-3-3-2-1';

describe('顧客条件マッチング機能 - 部分マッチスコア計算', () => {
  // SCEN-182
  test('新規案件の顧客ID欠落時に部分マッチスコアを正確に計算し、業種・売上規模マッチのみで評価', () => {
    // Arrange: テスト用の新規案件データを準備
    const newDealData = {
      customerId: null,
      industry: '製造業',
      salesRevenue: '100億円以上',
    };

    // スタブ化したAIRecommendationEngine
    const mockAIEngine = {
      evaluatePatternRelevance: jest.fn().mockReturnValue({
        score: 0.67,
        details: {
          industryMatch: 1.0,
          salesRevenueMatch: 1.0,
          customerIdMatch: 0.0,
        },
        reasonForReduction:
          '顧客ID未指定のため同一顧客との過去パターン照合不可',
        recommendedPatterns: [
          {
            patternId: 'PAT-001',
            industry: '製造業',
            salesRevenue: '100億円以上',
            successRate: 0.85,
            rank: 1,
          },
          {
            patternId: 'PAT-002',
            industry: '製造業',
            salesRevenue: '100億円以上',
            successRate: 0.82,
            rank: 2,
          },
          {
            patternId: 'PAT-003',
            industry: '製造業',
            salesRevenue: '100億円以上',
            successRate: 0.79,
            rank: 3,
          },
        ],
      }),
    };

    // Act: 顧客条件マッチング機能を実行
    const result = evaluatePatternRelevance(newDealData, mockAIEngine);

    // Assert: 返却されたマッチスコアと詳細情報を検証
    expect(result.partialMatchScore).toBeGreaterThanOrEqual(0.67);
    expect(result.partialMatchScore).toBeLessThanOrEqual(0.79);

    expect(result.scoreDetails.industryMatch).toBe(1.0);
    expect(result.scoreDetails.salesRevenueMatch).toBe(1.0);
    expect(result.scoreDetails.customerIdMatch).toBe(0.0);

    expect(result.reductionReason).toContain(
      '顧客ID未指定のため同一顧客との過去パターン照合不可'
    );

    // マッチスコアの内訳がシステムログに記録されていることを確認
    expect(result.logEntry).toEqual(
      expect.objectContaining({
        customerId: null,
        industry: '製造業',
        salesRevenue: '100億円以上',
        industryMatch: 1.0,
        salesRevenueMatch: 1.0,
        customerIdMatch: 0.0,
        partialMatchScore: expect.any(Number),
        reason:
          '顧客ID未指定のため同一顧客との過去パターン照合不可',
      })
    );

    // 推奨パターンマスタから業種・売上規模で合致する統計上位3件の成功パターンが候補として返却
    expect(result.candidatePatterns).toHaveLength(3);
    expect(result.candidatePatterns[0]).toEqual(
      expect.objectContaining({
        patternId: 'PAT-001',
        industry: '製造業',
        salesRevenue: '100億円以上',
        successRate: 0.85,
        rank: 1,
      })
    );
    expect(result.candidatePatterns[1]).toEqual(
      expect.objectContaining({
        patternId: 'PAT-002',
        industry: '製造業',
        salesRevenue: '100億円以上',
        successRate: 0.82,
        rank: 2,
      })
    );
    expect(result.candidatePatterns[2]).toEqual(
      expect.objectContaining({
        patternId: 'PAT-003',
        industry: '製造業',
        salesRevenue: '100億円以上',
        successRate: 0.79,
        rank: 3,
      })
    );

    mockAIEngine.evaluatePatternRelevance.mockClear();
  });
});