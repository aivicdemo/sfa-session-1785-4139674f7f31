import { verifyInferenceAccuracyMetrics } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-403
  test('[edge] 推論精度検証機能 - 精度計測対象レコード数が業務上の最大規模（10,001件超）のとき、全件を集計対象として処理完了', async () => {
    const targetRecordCount = 10001;
    const processingStartTime = Date.now();

    const mockAIRecommendationEngine = {
      findSimilarPatterns: jest.fn().mockResolvedValue({
        matchedPatterns: Array.from({ length: targetRecordCount }, (_, i) => ({
          dealId: `deal_${i + 1}`,
          similarityScore: 0.75 + Math.random() * 0.25,
          successFlag: Math.random() > 0.3,
        })),
      }),
      generateRecommendation: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const testDeals = Array.from({ length: targetRecordCount }, (_, i) => ({
      dealId: `deal_${i + 1}`,
      customerId: `cust_${Math.floor(i / 100) + 1}`,
      industry: ['IT', 'Finance', 'Manufacturing', 'Retail'][i % 4],
      companySize: ['Small', 'Medium', 'Large'][i % 3],
      dealAmount: 100000 + (i * 1000) % 500000,
      stageName: ['Initial', 'Proposal', 'Negotiation', 'Closing'][i % 4],
      successFlag: Math.random() > 0.3,
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-01-15T10:00:00Z',
    }));

    const verificationInput = {
      targetRecordCount: targetRecordCount,
      dealRecords: testDeals,
      verificationThresholdDate: '2024-01-15T10:00:00Z',
      maxProcessingTimeMs: 300000,
    };

    const result = await verifyInferenceAccuracyMetrics(
      verificationInput,
      mockAIRecommendationEngine
    );

    const processingEndTime = Date.now();
    const actualProcessingTimeMs = processingEndTime - processingStartTime;

    expect(result).toBeDefined();
    expect(result.status).toBe('completed');
    expect(result.processedRecordCount).toBe(10001);
    expect(result.totalRecordCount).toBe(10001);

    const successCount = testDeals.filter((deal) => deal.successFlag).length;
    const failureCount = targetRecordCount - successCount;

    const truePositiveCount = Math.floor(
      mockAIRecommendationEngine.findSimilarPatterns.mock.results[0].value
        .matchedPatterns.filter(
          (p: any) =>
            p.successFlag &&
            testDeals.find((d) => d.dealId === p.dealId)?.successFlag
        ).length
    );

    const falsePositiveCount = Math.floor(
      mockAIRecommendationEngine.findSimilarPatterns.mock.results[0].value
        .matchedPatterns.filter(
          (p: any) =>
            p.successFlag &&
            !testDeals.find((d) => d.dealId === p.dealId)?.successFlag
        ).length
    );

    const falseNegativeCount = Math.floor(
      mockAIRecommendationEngine.findSimilarPatterns.mock.results[0].value
        .matchedPatterns.filter(
          (p: any) =>
            !p.successFlag &&
            testDeals.find((d) => d.dealId === p.dealId)?.successFlag
        ).length
    );

    const precision =
      truePositiveCount + falsePositiveCount > 0
        ? truePositiveCount / (truePositiveCount + falsePositiveCount)
        : 0;

    const recall =
      truePositiveCount + falseNegativeCount > 0
        ? truePositiveCount / (truePositiveCount + falseNegativeCount)
        : 0;

    const fScore =
      precision + recall > 0
        ? (2 * precision * recall) / (precision + recall)
        : 0;

    expect(result.accuracyMetrics).toBeDefined();
    expect(result.accuracyMetrics.precision).toBeGreaterThanOrEqual(0);
    expect(result.accuracyMetrics.precision).toBeLessThanOrEqual(1);
    expect(result.accuracyMetrics.recall).toBeGreaterThanOrEqual(0);
    expect(result.accuracyMetrics.recall).toBeLessThanOrEqual(1);
    expect(result.accuracyMetrics.fScore).toBeGreaterThanOrEqual(0);
    expect(result.accuracyMetrics.fScore).toBeLessThanOrEqual(1);

    expect(result.reportMetadata).toBeDefined();
    expect(result.reportMetadata.targetRecordCount).toBe(10001);
    expect(result.reportMetadata.processedRecordCount).toBe(10001);
    expect(result.reportMetadata.isFullAggregation).toBe(true);

    expect(actualProcessingTimeMs).toBeLessThanOrEqual(300000);

    expect(mockAIRecommendationEngine.findSimilarPatterns).toHaveBeenCalled();
    expect(
      mockAIRecommendationEngine.findSimilarPatterns.mock.calls[0][0]
        .dealRecords.length
    ).toBe(10001);
  });
});