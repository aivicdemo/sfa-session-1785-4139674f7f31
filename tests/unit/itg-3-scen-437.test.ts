import { aggregateQualityReport } from '../../src/logic/itg-3';

describe('AIエージェント推奨支援システム - データ品質レポート集計機能', () => {
  test('SCEN-437: [normal] データ品質レポート集計機能 - 同じ入力で2回実行した場合、同じ集計結果が返される', async () => {
    const testCustomerId = 'CUST001';
    const testDealCondition = {
      industryCategory: 'IT',
      companySize: 'large',
      budgetRange: 'high',
      timeframeMonths: 6,
    };
    const testPeriodStart = new Date('2024-01-01T00:00:00Z');
    const testPeriodEnd = new Date('2024-12-31T23:59:59Z');

    const mockRecommendationPatternMaster = [
      {
        patternId: 'PAT001',
        industryCategory: 'IT',
        successRate: 0.85,
        matchScore: 92,
        applicabilityScore: 88,
        categoryClassification: 'enterprise_solution',
      },
      {
        patternId: 'PAT002',
        industryCategory: 'IT',
        successRate: 0.78,
        matchScore: 85,
        applicabilityScore: 82,
        categoryClassification: 'cloud_service',
      },
      {
        patternId: 'PAT003',
        industryCategory: 'IT',
        successRate: 0.72,
        matchScore: 78,
        applicabilityScore: 75,
        categoryClassification: 'support_service',
      },
    ];

    const mockS3UploadSuccess = {
      fileKey: 'reports/quality_report_20240115.pdf',
      uploadTimestamp: new Date('2024-01-15T10:30:00Z').toISOString(),
    };

    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        patterns: mockRecommendationPatternMaster,
        totalRecommendations: 3,
      }),
      findSimilarPatterns: jest.fn().mockResolvedValue(mockRecommendationPatternMaster),
      explainRecommendationReasoning: jest.fn().mockResolvedValue({
        reasoning: 'Based on customer profile and market analysis',
      }),
      evaluatePatternRelevance: jest.fn().mockResolvedValue({
        relevanceScores: mockRecommendationPatternMaster.map((p) => ({
          patternId: p.patternId,
          relevanceScore: p.matchScore,
        })),
      }),
    };

    const mockFileStorageAdapter = {
      uploadRecommendationReport: jest.fn().mockResolvedValue(mockS3UploadSuccess),
      generateDownloadUrl: jest.fn().mockResolvedValue({
        downloadUrl: 'https://s3.example.com/reports/quality_report_20240115.pdf',
        expiresAt: new Date('2024-01-15T11:30:00Z').toISOString(),
      }),
      deleteExpiredReports: jest.fn().mockResolvedValue({ deletedCount: 2 }),
    };

    const inputData = {
      customerId: testCustomerId,
      dealCondition: testDealCondition,
      periodStart: testPeriodStart,
      periodEnd: testPeriodEnd,
    };

    const firstExecutionResult = await aggregateQualityReport(inputData, mockAIRecommendationEngine, mockFileStorageAdapter);

    const secondExecutionResult = await aggregateQualityReport(inputData, mockAIRecommendationEngine, mockFileStorageAdapter);

    expect(firstExecutionResult.patternId).toEqual(secondExecutionResult.patternId);
    expect(firstExecutionResult.matchDegree).toEqual(secondExecutionResult.matchDegree);
    expect(firstExecutionResult.applicabilityEvaluation).toEqual(secondExecutionResult.applicabilityEvaluation);
    expect(firstExecutionResult.categoryClassification).toEqual(secondExecutionResult.categoryClassification);
    expect(firstExecutionResult.aggregatedRecordCount).toEqual(secondExecutionResult.aggregatedRecordCount);
    expect(firstExecutionResult.dataQualityScore).toEqual(secondExecutionResult.dataQualityScore);
    expect(firstExecutionResult.dataQualityScore).toBeGreaterThanOrEqual(0);
    expect(firstExecutionResult.dataQualityScore).toBeLessThanOrEqual(100);
    expect(firstExecutionResult.reasoningExplanation).toEqual(secondExecutionResult.reasoningExplanation);
    expect(firstExecutionResult.patterns).toHaveLength(3);
    expect(secondExecutionResult.patterns).toHaveLength(3);
    expect(firstExecutionResult.patterns[0].patternId).toBe('PAT001');
    expect(firstExecutionResult.patterns[0].matchScore).toBe(92);
    expect(firstExecutionResult.patterns[0].applicabilityScore).toBe(88);
    expect(firstExecutionResult.patterns[0].categoryClassification).toBe('enterprise_solution');
    expect(secondExecutionResult.patterns[0].patternId).toBe('PAT001');
    expect(secondExecutionResult.patterns[0].matchScore).toBe(92);
    expect(secondExecutionResult.patterns[0].applicabilityScore).toBe(88);
    expect(secondExecutionResult.patterns[0].categoryClassification).toBe('enterprise_solution');
  });
});