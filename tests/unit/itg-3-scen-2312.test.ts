import { visualizeAnomalousPatterns } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-2312
  test('提案内容と顧客対応パターンの標準プロセス比較機能 - 異常パターン可視化の対象期間が年度をまたぐとき複数年度のデータが正しく集計される', () => {
    const mockAIRecommendationEngine = {
      analyzePatterns: jest.fn(),
    };

    const previousFiscalYearData = Array.from({ length: 20 }, (_, i) => ({
      dealId: `deal_prev_${i}`,
      customerId: `cust_${i}`,
      dealDate: new Date(`2024-01-${String((i % 30) + 1).padStart(2, '0')}T10:00:00Z`),
      proposalContent: `Proposal ${i}`,
      customerResponsePattern: `Pattern_A`,
      deviationScore: 0.15 + (i * 0.01),
    }));

    const currentFiscalYearData = Array.from({ length: 30 }, (_, i) => ({
      dealId: `deal_curr_${i}`,
      customerId: `cust_prev_${20 + i}`,
      dealDate: new Date(`2024-${String((i % 12) + 4).padStart(2, '0')}-${String((i % 28) + 1).padStart(2, '0')}T10:00:00Z`),
      proposalContent: `Proposal ${20 + i}`,
      customerResponsePattern: `Pattern_B`,
      deviationScore: 0.20 + (i * 0.01),
    }));

    mockAIRecommendationEngine.analyzePatterns.mockResolvedValue({
      allDealData: [...previousFiscalYearData, ...currentFiscalYearData],
    });

    const queryPeriod = {
      startDate: new Date('2024-01-01T00:00:00Z'),
      endDate: new Date('2025-03-31T23:59:59Z'),
    };

    const result = visualizeAnomalousPatterns(
      mockAIRecommendationEngine,
      queryPeriod,
      {
        anomalyThreshold: 0.25,
        groupByFiscalYear: true,
      }
    );

    expect(result.aggregationMetadata.aggregationPeriod.startDate).toEqual(
      new Date('2024-01-01T00:00:00Z')
    );
    expect(result.aggregationMetadata.aggregationPeriod.endDate).toEqual(
      new Date('2025-03-31T23:59:59Z')
    );

    expect(result.aggregationMetadata.totalRecordCount).toBe(50);
    expect(result.aggregationMetadata.spanMultipleFiscalYears).toBe(true);

    expect(result.fiscalYearBreakdown).toEqual({
      '2023': {
        recordCount: 20,
        startDate: new Date('2024-01-01T00:00:00Z'),
        endDate: new Date('2024-03-31T23:59:59Z'),
      },
      '2024': {
        recordCount: 30,
        startDate: new Date('2024-04-01T00:00:00Z'),
        endDate: new Date('2025-03-31T23:59:59Z'),
      },
    });

    expect(result.anomalousPatterns).toBeDefined();
    expect(Array.isArray(result.anomalousPatterns)).toBe(true);

    const anomalyCount = result.anomalousPatterns.filter(
      (p) => p.deviationScore >= 0.25
    ).length;
    expect(anomalyCount).toBeGreaterThanOrEqual(0);

    expect(result.aggregationMetadata.fiscalYearSpan).toEqual(['2023', '2024']);
  });
});