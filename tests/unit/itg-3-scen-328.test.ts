import { evaluateRecommendationAccuracy } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェント推奨根拠の可視化機能 - 推奨精度検証', () => {
  // SCEN-328
  test('[normal] 推奨精度検証機能 - 検証対象の過去推奨履歴が1件の場合、精度計測が正常に完了する', async () => {
    const mockRecommendationEngine = {
      evaluatePatternRelevance: jest.fn().mockResolvedValue({
        relevanceScore: 0.95,
        isApplicable: true,
      }),
    };

    const verificationInput = {
      verificationStartDate: new Date('2026-01-01T00:00:00Z'),
      verificationEndDate: new Date('2026-01-31T23:59:59Z'),
      recommendationHistoryRecords: [
        {
          recommendationId: 'REC-001',
          dealId: 'DEAL-001',
          proposedApproach: 'ProposalApproachA',
          actualResult: 'contracted',
          createdAt: new Date('2026-01-15T10:30:00Z'),
          recommendationScore: 0.95,
        },
      ],
    };

    const result = await evaluateRecommendationAccuracy(
      verificationInput,
      mockRecommendationEngine
    );

    expect(result.statusCode).toBe(200);
    expect(result.responseBody.verificationTargetCount).toBe(1);
    expect(result.responseBody.completionStatus).toBe('completed');
    expect(result.responseBody.overallAccuracyScore).toBe(0.95);
    expect(result.responseBody.errorMessage).toBe('');
    expect(result.responseBody.measurementExecutedAt).toBeDefined();

    const measurementDate = new Date(result.responseBody.measurementExecutedAt);
    expect(measurementDate.getTime()).toBeGreaterThan(0);

    expect(result.accuracyMeasurementRecord.measurementId).toBeDefined();
    expect(result.accuracyMeasurementRecord.verificationTargetCount).toBe(1);
    expect(result.accuracyMeasurementRecord.measurementStatus).toBe('completed');
    expect(result.accuracyMeasurementRecord.accuracyScore).toBe(0.95);
    expect(result.accuracyMeasurementRecord.measurementTimestamp).toBeDefined();

    expect(mockRecommendationEngine.evaluatePatternRelevance).toHaveBeenCalledTimes(1);
    expect(mockRecommendationEngine.evaluatePatternRelevance).toHaveBeenCalledWith(
      expect.objectContaining({
        dealId: 'DEAL-001',
        proposedApproach: 'ProposalApproachA',
        actualResult: 'contracted',
      })
    );
  });
});