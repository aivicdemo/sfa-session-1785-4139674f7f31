import { generateRecommendationReport } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン抽出・照合・推奨機能 - FileStorageAdapter failure handling', () => {
  // SCEN-1897
  test('generateDownloadUrl が null を返すとき推奨レポート取得に失敗する', async () => {
    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendationId: 'rec-001',
        customerName: 'Test Corp',
        industry: 'Technology',
        recommendedApproach: 'Value-based selling',
        confidenceScore: 85,
        successPatterns: [
          {
            patternId: 'pat-001',
            name: 'Enterprise Deal Pattern',
            applicabilityScore: 90,
          },
        ],
        reasoning: 'High-value customer matching enterprise pattern',
      }),
      findSimilarPatterns: jest.fn().mockResolvedValue([]),
      explainRecommendationReasoning: jest.fn().mockResolvedValue('Pattern matched'),
      evaluatePatternRelevance: jest.fn().mockResolvedValue(85),
    };

    const mockFileStorageAdapter = {
      uploadRecommendationReport: jest.fn().mockResolvedValue({
        fileKey: 'reports/rec-001/recommendation.pdf',
        uploadedAt: new Date('2024-01-15T10:00:00Z').toISOString(),
      }),
      generateDownloadUrl: jest.fn().mockResolvedValue(null),
      deleteExpiredReports: jest.fn().mockResolvedValue(undefined),
    };

    const customerData = {
      customerId: 'cust-001',
      companyName: 'Test Corp',
      industry: 'Technology',
      companySize: 'Large',
      annualRevenue: 50000000,
    };

    const dealConditions = {
      dealId: 'deal-001',
      dealValue: 500000,
      productCategory: 'Enterprise Software',
      timeline: '3 months',
      decisionMakers: ['CTO', 'CFO'],
    };

    let reportResult;
    let errorThrown = false;
    let errorMessage = '';

    try {
      reportResult = await generateRecommendationReport(
        customerData,
        dealConditions,
        mockAIRecommendationEngine,
        mockFileStorageAdapter,
      );
    } catch (error) {
      errorThrown = true;
      if (error instanceof Error) {
        errorMessage = error.message;
      }
    }

    expect(errorThrown).toBe(true);
    expect(errorMessage).toMatch(/レポート生成/);
    expect(reportResult).toBeUndefined();
    expect(mockAIRecommendationEngine.generateRecommendation).toHaveBeenCalledWith(
      customerData,
      dealConditions,
    );
    expect(mockFileStorageAdapter.uploadRecommendationReport).toHaveBeenCalled();
    expect(mockFileStorageAdapter.generateDownloadUrl).toHaveBeenCalledWith('reports/rec-001/recommendation.pdf');
  });
});