import { uploadRecommendationReportWithRetry } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-2707
  test('推奨レポート生成・保存機能 - FileStorageAdapterの1回目失敗後に3秒待機して再試行される', async () => {
    const mockRecommendationData = {
      customerId: 'CUST-001',
      recommendationId: 'REC-20240115-001',
      proposalApproach: 'クラウド導入プラン',
      confidenceScore: 92,
      reasoning: '過去の類似事例から成功率が高い提案内容',
      successPatterns: [
        {
          patternId: 'PAT-CLOUD-001',
          matchScore: 0.95,
          description: 'クラウド導入による業務効率化'
        }
      ],
      baseData: {
        customerIndustry: '製造業',
        customerSize: '中規模',
        dealAmount: 5000000,
        timelineDays: 180
      },
      generatedAt: new Date('2024-01-15T11:00:00Z').toISOString()
    };

    const mockFileStorageAdapter = {
      uploadRecommendationReport: jest.fn()
        .mockRejectedValueOnce(new Error('NetworkError: Connection timeout'))
        .mockResolvedValueOnce({
          s3Key: 'recommendations/REC-20240115-001/report.pdf',
          bucket: 'sales-ai-reports',
          uploadedAt: new Date('2024-01-15T11:00:03Z').toISOString(),
          fileSize: 245632,
          contentType: 'application/pdf'
        })
    };

    const mockReportMetadataRepository = {
      save: jest.fn().mockResolvedValue({
        id: 'META-20240115-001',
        reportId: 'REC-20240115-001',
        s3Key: 'recommendations/REC-20240115-001/report.pdf',
        bucket: 'sales-ai-reports',
        fileSize: 245632,
        contentType: 'application/pdf',
        uploadedAt: new Date('2024-01-15T11:00:03Z').toISOString(),
        expiresAt: new Date('2024-02-14T11:00:03Z').toISOString(),
        createdAt: new Date('2024-01-15T11:00:03Z').toISOString()
      })
    };

    const startTime = Date.now();

    const result = await uploadRecommendationReportWithRetry(
      mockRecommendationData,
      'PDF',
      mockFileStorageAdapter,
      mockReportMetadataRepository
    );

    const elapsedTime = Date.now() - startTime;

    expect(mockFileStorageAdapter.uploadRecommendationReport).toHaveBeenCalledTimes(2);

    expect(mockFileStorageAdapter.uploadRecommendationReport).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        customerId: 'CUST-001',
        recommendationId: 'REC-20240115-001',
        proposalApproach: 'クラウド導入プラン'
      }),
      'PDF'
    );

    expect(mockFileStorageAdapter.uploadRecommendationReport).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        customerId: 'CUST-001',
        recommendationId: 'REC-20240115-001',
        proposalApproach: 'クラウド導入プラン'
      }),
      'PDF'
    );

    expect(elapsedTime).toBeGreaterThanOrEqual(3000);
    expect(elapsedTime).toBeLessThan(3100);

    expect(mockReportMetadataRepository.save).toHaveBeenCalledTimes(1);

    expect(mockReportMetadataRepository.save).toHaveBeenCalledWith(
      expect.objectContaining({
        s3Key: 'recommendations/REC-20240115-001/report.pdf',
        bucket: 'sales-ai-reports',
        fileSize: 245632,
        contentType: 'application/pdf'
      })
    );

    expect(result).toEqual(
      expect.objectContaining({
        success: true,
        metadataId: 'META-20240115-001',
        s3Key: 'recommendations/REC-20240115-001/report.pdf',
        fileSize: 245632,
        uploadedAt: new Date('2024-01-15T11:00:03Z').toISOString()
      })
    );
  });
});