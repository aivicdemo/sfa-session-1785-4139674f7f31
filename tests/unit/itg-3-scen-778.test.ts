import { describe, test, expect, jest, beforeEach, afterEach } from '@jest/globals';
import { generateRecommendationReport } from '../../src/logic/it-1-br-3-1-1-1';

const mockFileStorageAdapter = {
  uploadRecommendationReport: jest.fn(),
  generateDownloadUrl: jest.fn(),
  deleteExpiredReports: jest.fn(),
};

describe('AIエージェント推奨根拠の可視化機能 - ファイルストレージ失敗時の振る舞い', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  // SCEN-778: ファイルストレージ失敗時の3秒後の再試行
  test('FileStorageAdapter.uploadRecommendationReport が1回目で失敗した場合、3秒後に再試行され2回目が成功する', async () => {
    const recommendationData = {
      dealId: 'DEAL-12345',
      customerId: 'CUST-67890',
      recommendationContent: '顧客の購買シグナルに基づいた提案タイミング推奨',
      confidenceScore: 85,
      reasoningBasis: [
        {
          factorType: 'purchase_history',
          description: '過去3ヶ月の購買パターン分析',
          weight: 0.4,
        },
        {
          factorType: 'success_pattern_match',
          description: '類似顧客の成功パターンとの一致度',
          weight: 0.6,
        },
      ],
      generatedAt: new Date('2024-01-15T11:00:00Z'),
      reportFormat: 'PDF',
    };

    const expectedMetadata = {
      reportId: 'RPT-20240115-001',
      dealId: 'DEAL-12345',
      customerId: 'CUST-67890',
      uploadedAt: new Date('2024-01-15T11:00:03Z'),
      s3Location: 's3://sales-ai-bucket/recommendations/RPT-20240115-001.pdf',
      format: 'PDF',
      status: 'completed',
    };

    mockFileStorageAdapter.uploadRecommendationReport
      .mockRejectedValueOnce(new Error('S3 upload failed'))
      .mockResolvedValueOnce({
        reportId: expectedMetadata.reportId,
        s3Location: expectedMetadata.s3Location,
      });

    const resultPromise = generateRecommendationReport(recommendationData, mockFileStorageAdapter);

    await jest.advanceTimersByTimeAsync(100);
    expect(mockFileStorageAdapter.uploadRecommendationReport).toHaveBeenCalledTimes(1);
    expect(mockFileStorageAdapter.uploadRecommendationReport).toHaveBeenCalledWith(
      expect.objectContaining({
        dealId: 'DEAL-12345',
        customerId: 'CUST-67890',
        reportFormat: 'PDF',
      })
    );

    jest.advanceTimersByTime(3000);

    const result = await resultPromise;

    expect(mockFileStorageAdapter.uploadRecommendationReport).toHaveBeenCalledTimes(2);

    const firstCallTime = mockFileStorageAdapter.uploadRecommendationReport.mock.invocationCallOrder[0];
    const secondCallTime = mockFileStorageAdapter.uploadRecommendationReport.mock.invocationCallOrder[1];
    expect(secondCallTime - firstCallTime).toBeGreaterThan(0);

    expect(result).toEqual(
      expect.objectContaining({
        reportId: 'RPT-20240115-001',
        dealId: 'DEAL-12345',
        customerId: 'CUST-67890',
        s3Location: 's3://sales-ai-bucket/recommendations/RPT-20240115-001.pdf',
        format: 'PDF',
        status: 'completed',
      })
    );

    expect(result.s3Location).toBe('s3://sales-ai-bucket/recommendations/RPT-20240115-001.pdf');
  });
});