import { evaluateRecommendationRelevance } from '../../src/logic/it-1-br-3-3-2-1';

describe('推奨妥当性スコア算出機能', () => {
  test('SCEN-1727: 推奨時期の開始日と終了日が同日のとき推奨スコアを計算する', () => {
    const mockAIEngine = {
      evaluatePatternRelevance: jest.fn().mockReturnValue(0.85),
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
    };

    const customerInfo = {
      customerId: 'CUST-20260815-001',
      industry: '製造業',
      scale: '大企業',
      existingProducts: ['product-a', 'product-b'],
      budget: 5000000,
    };

    const dealCondition = {
      dealId: 'DEAL-20260815-001',
      dealName: '新規システム導入提案',
      stage: '初期接触',
      dealValue: 3500000,
      decisionTimeline: '3ヶ月以内',
      stakeholders: ['IT部長', '経営層'],
    };

    const recommendationTimingStart = '2026-08-15';
    const recommendationTimingEnd = '2026-08-15';

    const result = evaluateRecommendationRelevance(
      customerInfo,
      dealCondition,
      recommendationTimingStart,
      recommendationTimingEnd,
      mockAIEngine
    );

    expect(result.scoreValue).toBeGreaterThanOrEqual(0);
    expect(result.scoreValue).toBeLessThanOrEqual(1.0);
    expect(result.scoreValue).toBe(0.78);
    expect(result.startDate).toBe('2026-08-15');
    expect(result.endDate).toBe('2026-08-15');
    expect(result.dateRangeDaysDifference).toBe(0);
    expect(result.validationError).toBeNull();
    expect(mockAIEngine.evaluatePatternRelevance).toHaveBeenCalledWith(
      expect.objectContaining({
        customerId: 'CUST-20260815-001',
        dealId: 'DEAL-20260815-001',
      })
    );
  });
});