import { generateRecommendationReport } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  test('SCEN-584: 推奨内容が0個のときき空レポートファイルが生成される', async () => {
    // Arrange
    const dealId = 'DEAL-20240115-001';
    const customerId = 'CUST-20240115-001';
    const generatedAt = new Date('2024-01-15T11:00:00Z');

    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn().mockResolvedValue([]),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const mockFileStorageAdapter = {
      uploadRecommendationReport: jest.fn().mockResolvedValue({
        fileKey: `reports/${dealId}/recommendation-report-2024-01-15-110000.pdf`,
        downloadUrl: `https://s3.amazonaws.com/bucket/reports/${dealId}/recommendation-report-2024-01-15-110000.pdf`,
        expiresAt: new Date('2024-01-16T11:00:00Z'),
      }),
      generateDownloadUrl: jest.fn(),
      deleteExpiredReports: jest.fn(),
    };

    const dealData = {
      dealId: dealId,
      customerId: customerId,
      dealName: 'テスト案件',
      dealStage: '提案段階',
      dealAmount: 1000000,
      expectedCloseDate: new Date('2024-02-15T00:00:00Z'),
    };

    // Act
    const result = await generateRecommendationReport(
      dealData,
      mockAIRecommendationEngine,
      mockFileStorageAdapter,
      generatedAt
    );

    // Assert
    expect(mockAIRecommendationEngine.generateRecommendation).toHaveBeenCalledWith(dealData);
    expect(mockFileStorageAdapter.uploadRecommendationReport).toHaveBeenCalled();

    const uploadCall = mockFileStorageAdapter.uploadRecommendationReport.mock.calls[0];
    const reportContent = uploadCall[0];

    expect(reportContent.dealId).toBe(dealId);
    expect(reportContent.customerId).toBe(customerId);
    expect(reportContent.recommendations).toEqual([]);
    expect(reportContent.recommendationCount).toBe(0);
    expect(reportContent.generatedAt).toEqual(generatedAt);
    expect(reportContent.reportSections.header).toBeDefined();
    expect(reportContent.reportSections.dealInfo).toBeDefined();
    expect(reportContent.reportSections.recommendations).toEqual([]);
    expect(reportContent.reportSections.metadata).toBeDefined();

    expect(result.success).toBe(true);
    expect(result.fileKey).toBe(`reports/${dealId}/recommendation-report-2024-01-15-110000.pdf`);
    expect(result.downloadUrl).toBe(
      `https://s3.amazonaws.com/bucket/reports/${dealId}/recommendation-report-2024-01-15-110000.pdf`
    );
    expect(result.metadata.dealId).toBe(dealId);
    expect(result.metadata.customerId).toBe(customerId);
    expect(result.metadata.recommendationCount).toBe(0);
    expect(result.metadata.generatedAt).toEqual(generatedAt);
    expect(result.metadata.fileSize).toBeGreaterThan(0);
    expect(result.metadata.format).toBe('pdf');
  });
});