import { evaluateRecommendationRelevance } from '../../src/logic/it-1-br-3-3-2-1';

describe('推奨妥当性スコア算出機能', () => {
  // SCEN-1725
  test('推奨時期が月末のとき推奨スコアを正しく計算する', () => {
    // Mock AIRecommendationEngine
    const mockAIEngine = {
      evaluatePatternRelevance: jest.fn().mockResolvedValue({
        patternFitScore: 0.85,
        timingFitCoefficient: 0.92,
        customerMatchScore: 0.88,
      }),
    };

    // テストデータ: 月末日付（2026年1月31日）
    const monthEndRecommendationData = {
      customerId: 'CUST-001',
      dealId: 'DEAL-2026-001',
      recommendedTiming: new Date('2026-01-31T23:59:59Z'),
      recommendedApproach: 'Value-based Selling',
      pastSuccessPatterns: [
        {
          patternId: 'PAT-001',
          matchScore: 0.85,
        },
      ],
      customerAttributes: {
        industry: 'IT',
        scale: 'Enterprise',
        region: 'Asia Pacific',
      },
    };

    // スコア計算: (0.85 × 0.4 + 0.92 × 0.35 + 0.88 × 0.25) × 100
    // = (0.34 + 0.322 + 0.22) × 100
    // = 0.8815 × 100
    // = 88.15
    // ※小数第2位四捨五入時点では88.15
    const expectedScore = 88.15;

    // evaluatePatternRelevanceを呼び出しのスタブとして利用
    const result = evaluateRecommendationRelevance(
      monthEndRecommendationData,
      mockAIEngine,
    );

    expect(result.recommendationScore).toBe(expectedScore);
    expect(result.timingAdjustmentFactor).toBe(0.92);
    expect(mockAIEngine.evaluatePatternRelevance).toHaveBeenCalledWith(
      expect.objectContaining({
        customerId: 'CUST-001',
        dealId: 'DEAL-2026-001',
      }),
    );
  });
});