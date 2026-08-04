import { generateExecutiveBriefing } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-2011
  test('照合評価結果が0件のとき、資料生成がスキップされ空の資料が返却される', async () => {
    const mockAIEngine = {
      evaluatePatternRelevance: jest.fn().mockResolvedValue({
        matchedPatterns: [],
        relevanceScore: 0,
        evaluationCount: 0,
      }),
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
    };

    const mockFileStorage = {
      uploadRecommendationReport: jest.fn(),
      generateDownloadUrl: jest.fn(),
      deleteExpiredReports: jest.fn(),
    };

    const customerInput = {
      customerId: 'CUST-20240115-001',
      companyName: 'SampleCorp Inc.',
      industry: 'IT',
      employeeCount: 150,
      annualRevenue: 5000000,
      budget: 200000,
      purchaseTimeline: '2024-02',
    };

    const proposalInput = {
      proposalId: 'PROP-20240115-001',
      productName: 'CloudAnalytics Pro',
      proposalAmount: 150000,
      expectedROI: 250,
      implementationDays: 90,
    };

    const result = await generateExecutiveBriefing(
      customerInput,
      proposalInput,
      mockAIEngine,
      mockFileStorage
    );

    expect(result.content).toBe('');
    expect(result.sections).toEqual([]);
    expect(result.status).toBe('skipped');
    expect(result.skipReason).toMatch(/照合評価結果が0件のため資料生成をスキップ/);
    expect(mockAIEngine.generateRecommendation).not.toHaveBeenCalled();
    expect(mockFileStorage.uploadRecommendationReport).not.toHaveBeenCalled();
  });
});