import { evaluatePurchaseHistoryDataQuality } from '../../src/logic/it-1-br-3-3-2-1';

describe('Purchase History Data Quality Evaluation with Month-Start Date', () => {
  test('SCEN-1515: Month-start purchase date is correctly evaluated with quality score between 0-100', async () => {
    const mockAIEngine = {
      findSimilarPatterns: jest.fn().mockResolvedValue([
        {
          patternId: 'pattern_001',
          similarity: 0.85,
          successRate: 0.92,
          customerSegment: 'enterprise',
          productCategory: 'software_license',
        },
        {
          patternId: 'pattern_002',
          similarity: 0.78,
          successRate: 0.88,
          customerSegment: 'mid_market',
          productCategory: 'support_service',
        },
      ]),
      generateRecommendation: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const purchaseHistoryData = {
      records: [
        {
          purchaseId: 'purch_001',
          customerId: 'cust_001',
          purchaseDate: '2024-01-01',
          amount: 150000,
          productCategory: 'software_license',
          quantity: 5,
        },
        {
          purchaseId: 'purch_002',
          customerId: 'cust_001',
          purchaseDate: '2024-01-15',
          amount: 75000,
          productCategory: 'support_service',
          quantity: 2,
        },
        {
          purchaseId: 'purch_003',
          customerId: 'cust_002',
          purchaseDate: '2024-02-01',
          amount: 200000,
          productCategory: 'software_license',
          quantity: 8,
        },
      ],
      evaluationPeriod: {
        startDate: '2024-01-01',
        endDate: '2024-02-29',
      },
    };

    const result = await evaluatePurchaseHistoryDataQuality(
      purchaseHistoryData,
      mockAIEngine
    );

    expect(result).toBeDefined();
    expect(result.overallStatus).toMatch(/合格|判定完了/);
    expect(result.qualityScore).toBeGreaterThanOrEqual(0);
    expect(result.qualityScore).toBeLessThanOrEqual(100);
    expect(result.recordEvaluations).toBeDefined();
    expect(Array.isArray(result.recordEvaluations)).toBe(true);

    const monthStartRecord = result.recordEvaluations.find(
      (record: any) => record.purchaseId === 'purch_001'
    );
    expect(monthStartRecord).toBeDefined();
    expect(monthStartRecord.evaluationStatus).toMatch(/合格|判定完了/);
    expect(monthStartRecord.metadata).toBeDefined();
    expect(monthStartRecord.metadata.isMonthStartDate).toBe(true);
    expect(monthStartRecord.metadata.businessDayValidation).toMatch(
      /月初日付は有効な営業日/
    );

    expect(mockAIEngine.findSimilarPatterns).toHaveBeenCalled();
    expect(result.errors).toBeUndefined();
    expect(result.exceptions).toBeUndefined();
  });
});