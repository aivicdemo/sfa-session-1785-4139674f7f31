import { generateReport } from '../../src/logic/it-1-br-3-2-1-1';

describe('AIエージェント推奨内容の根拠表示機能', () => {
  // SCEN-2346
  test('根拠情報が欠落しているときレポート生成が中断される', async () => {
    const proposalId = 'PROP-20240115-001';
    const customerInfo = {
      customerId: 'CUST-001',
      companyName: 'TechCorp Inc',
      industry: 'IT',
      scale: 'large',
    };
    const dealConditions = {
      dealId: 'DEAL-001',
      stage: 'proposal',
      amount: 5000000,
      timeline: '2024-03-31',
    };

    const mockAIEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendationId: 'REC-001',
        proposedApproach: 'Implement cloud migration strategy',
        confidenceScore: 85,
        reasoningData: null,
      }),
      findSimilarPatterns: jest.fn().mockResolvedValue([]),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const mockFileStorage = {
      uploadRecommendationReport: jest.fn(),
      generateDownloadUrl: jest.fn(),
      deleteExpiredReports: jest.fn(),
    };

    const result = await generateReport(
      proposalId,
      customerInfo,
      dealConditions,
      mockAIEngine,
      mockFileStorage
    );

    expect(result.success).toBe(false);
    expect(result.errorCode).toBe('MISSING_REASONING_DATA');
    expect(result.message).toBe(
      '根拠情報が不足しているため、レポート生成を中断しました'
    );
    expect(result.reportId).toBe(null);
    expect(mockFileStorage.uploadRecommendationReport).not.toHaveBeenCalled();
  });
});