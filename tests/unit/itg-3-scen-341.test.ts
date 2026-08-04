import { evaluateRecommendationAccuracy } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェント推奨精度検証機能 - 推奨根拠の可視化', () => {
  // SCEN-341
  test('推奨精度が100%の場合、精度スコアとして正常に計測される', () => {
    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendationId: 'REC-20260801-001',
        proposalApproach: '顧客の業界特性に基づいた段階的提案',
        confidenceScore: 95,
      }),
      evaluatePatternRelevance: jest.fn().mockReturnValue(1.0),
      findSimilarPatterns: jest.fn().mockResolvedValue([
        {
          caseId: 'CASE-2025-001',
          similarity: 0.95,
          successOutcome: true,
        },
      ]),
      explainRecommendationReasoning: jest.fn().mockResolvedValue(
        '過去の類似案件（顧客規模500-1000名、製造業）で成功した提案パターンを適用'
      ),
    };

    const newCaseCondition = {
      customerId: 'CUST-202608-100',
      customerIndustry: '製造業',
      customerScale: 750,
      dealCondition: '新規コンサルティング契約',
      proposedAmount: 5000000,
      dealTimeline: 60,
    };

    const accuracyMeasurement = evaluateRecommendationAccuracy(
      newCaseCondition,
      mockAIRecommendationEngine
    );

    expect(typeof accuracyMeasurement.accuracyScore).toBe('number');
    expect(accuracyMeasurement.accuracyScore).toBe(1.0);
    expect(accuracyMeasurement.accuracyScore).toBeLessThanOrEqual(1.0);
    expect(accuracyMeasurement.accuracyScore).toBeGreaterThanOrEqual(0);
    expect(accuracyMeasurement.isRecordedInMeasurementStorage).toBe(true);
    expect(accuracyMeasurement.canBeReferencedForReporting).toBe(true);
    expect(mockAIRecommendationEngine.evaluatePatternRelevance).toHaveBeenCalledWith(
      expect.objectContaining({
        customerId: 'CUST-202608-100',
        customerIndustry: '製造業',
      })
    );
  });
});