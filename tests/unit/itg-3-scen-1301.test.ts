import { generateRecommendationReportWithRetry } from '../../src/logic/it-1-br-3-1-1-1';

describe('推奨レポート生成・保存機能', () => {
  test('SCEN-1301: Amazon S3アップロード失敗時の再試行が最大2回実行される', async () => {
    const mockFileStorageAdapter = {
      uploadRecommendationReport: jest.fn(),
    };

    mockFileStorageAdapter.uploadRecommendationReport
      .mockRejectedValueOnce(new Error('Upload failed'))
      .mockRejectedValueOnce(new Error('Upload failed'))
      .mockResolvedValueOnce({
        fileUrl: 'https://s3.amazonaws.com/reports/recommendation-123.pdf',
        uploadedAt: new Date('2024-01-15T11:00:00Z').toISOString(),
      });

    const recommendationData = {
      recommendationId: 'rec-001',
      customerId: 'cust-123',
      proposalApproach: 'Cross-sell bundled package based on purchase history',
      confidenceScore: 87,
      reasoning: [
        'Customer purchased Product A in Q3 2023',
        'Similar customers (92% match) upgraded to bundle in 30 days',
        'Current quarter shows budget availability signal',
      ],
      successPatternMatches: [
        { patternId: 'sp-045', matchPercentage: 92 },
        { patternId: 'sp-068', matchPercentage: 78 },
      ],
      riskFactors: ['Market volatility may delay decision'],
    };

    jest.useFakeTimers();

    const resultPromise = generateRecommendationReportWithRetry(
      recommendationData,
      mockFileStorageAdapter
    );

    await jest.advanceTimersByTimeAsync(3000);
    await jest.advanceTimersByTimeAsync(10000);

    const result = await resultPromise;

    jest.useRealTimers();

    expect(result).toEqual({
      success: true,
      fileUrl: 'https://s3.amazonaws.com/reports/recommendation-123.pdf',
      uploadedAt: '2024-01-15T11:00:00Z',
      retryCount: 2,
    });

    expect(mockFileStorageAdapter.uploadRecommendationReport).toHaveBeenCalledTimes(3);

    expect(mockFileStorageAdapter.uploadRecommendationReport).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        recommendationId: 'rec-001',
        customerId: 'cust-123',
      })
    );

    expect(mockFileStorageAdapter.uploadRecommendationReport).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        recommendationId: 'rec-001',
        customerId: 'cust-123',
      })
    );

    expect(mockFileStorageAdapter.uploadRecommendationReport).toHaveBeenNthCalledWith(
      3,
      expect.objectContaining({
        recommendationId: 'rec-001',
        customerId: 'cust-123',
      })
    );
  });
});