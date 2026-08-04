import { visualizeAnomalousPatterns } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-2311
  test('対象期間の開始日と終了日が同日のとき同日のデータのみが比較される', () => {
    const targetDate = new Date('2026-08-01T00:00:00Z');
    const startDate = new Date('2026-08-01T00:00:00Z');
    const endDate = new Date('2026-08-01T00:00:00Z');

    const beforeDateData = {
      dealId: 'DEAL-001',
      dealDate: new Date('2026-07-31T10:00:00Z'),
      customerId: 'CUST-001',
      proposalContent: 'Before proposal',
      customerResponsePattern: 'pattern-before',
      processDeviation: 5,
      successPatternMatch: 0.65,
    };

    const targetDateData1 = {
      dealId: 'DEAL-002',
      dealDate: new Date('2026-08-01T09:00:00Z'),
      customerId: 'CUST-002',
      proposalContent: 'Target proposal 1',
      customerResponsePattern: 'pattern-target-1',
      processDeviation: 15,
      successPatternMatch: 0.45,
    };

    const targetDateData2 = {
      dealId: 'DEAL-003',
      dealDate: new Date('2026-08-01T14:30:00Z'),
      customerId: 'CUST-003',
      proposalContent: 'Target proposal 2',
      customerResponsePattern: 'pattern-target-2',
      processDeviation: 8,
      successPatternMatch: 0.72,
    };

    const afterDateData = {
      dealId: 'DEAL-004',
      dealDate: new Date('2026-08-02T11:00:00Z'),
      customerId: 'CUST-004',
      proposalContent: 'After proposal',
      customerResponsePattern: 'pattern-after',
      processDeviation: 3,
      successPatternMatch: 0.88,
    };

    const allDealData = [
      beforeDateData,
      targetDateData1,
      targetDateData2,
      afterDateData,
    ];

    const mockAIRecommendationEngine = {
      findSimilarPatterns: jest.fn().mockResolvedValue({
        matchedPatterns: allDealData.map((data) => ({
          dealId: data.dealId,
          similarity: data.successPatternMatch,
        })),
      }),
      evaluatePatternRelevance: jest.fn().mockResolvedValue({
        patterns: allDealData.map((data) => ({
          dealId: data.dealId,
          relevanceScore: data.successPatternMatch,
        })),
      }),
    };

    const comparisonParams = {
      startDate,
      endDate,
      dealDataset: allDealData,
      standardProcessDefinition: {
        maxDeviationThreshold: 20,
        minSuccessPatternMatch: 0.5,
      },
    };

    const result = visualizeAnomalousPatterns(
      comparisonParams,
      mockAIRecommendationEngine,
    );

    expect(result.comparisonDataset).toHaveLength(2);
    expect(result.comparisonDataset[0].dealId).toBe('DEAL-002');
    expect(result.comparisonDataset[0].dealDate).toEqual(
      new Date('2026-08-01T09:00:00Z'),
    );
    expect(result.comparisonDataset[1].dealId).toBe('DEAL-003');
    expect(result.comparisonDataset[1].dealDate).toEqual(
      new Date('2026-08-01T14:30:00Z'),
    );

    expect(result.excludedBeforePeriodCount).toBe(1);
    expect(result.excludedAfterPeriodCount).toBe(1);
    expect(result.totalIncludedRecords).toBe(2);

    const dealIdsInResult = result.comparisonDataset.map((d) => d.dealId);
    expect(dealIdsInResult).not.toContain('DEAL-001');
    expect(dealIdsInResult).not.toContain('DEAL-004');
  });
});