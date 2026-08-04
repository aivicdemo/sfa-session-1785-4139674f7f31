import { uploadRecommendationReport } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-1028
  test('[edge] ファイル生成・保存時のリトライ処理 - Amazon S3初回アップロード失敗時、3秒後に再試行される', async () => {
    jest.useFakeTimers();

    const mockStorageAdapter = {
      uploadRecommendationReport: jest.fn()
        .mockRejectedValueOnce(new Error('Network error'))
        .mockResolvedValueOnce({
          bucket: 'recommendation-reports',
          key: 'report-2024-01-15-sample.pdf',
          uploadedAt: '2024-01-15T11:00:03Z',
        }),
    };

    const reportData = {
      recommendationId: 'rec-001',
      customerId: 'cust-001',
      recommendedApproach: 'Proposal for digital transformation initiative',
      confidenceScore: 85,
      evidenceList: [
        {
          pastCaseId: 'case-001',
          similarity: 0.92,
          successOutcome: 'Contract signed for 2.5M JPY',
        },
        {
          pastCaseId: 'case-002',
          similarity: 0.88,
          successOutcome: 'Contract signed for 1.8M JPY',
        },
      ],
      generatedAt: '2024-01-15T11:00:00Z',
    };

    const uploadPromise = uploadRecommendationReport(
      reportData,
      mockStorageAdapter as any
    );

    expect(mockStorageAdapter.uploadRecommendationReport).toHaveBeenCalledTimes(1);

    jest.advanceTimersByTime(3000);

    await jest.runAllTimersAsync();
    const result = await uploadPromise;

    expect(mockStorageAdapter.uploadRecommendationReport).toHaveBeenCalledTimes(2);
    expect(result).toEqual({
      bucket: 'recommendation-reports',
      key: 'report-2024-01-15-sample.pdf',
      uploadedAt: '2024-01-15T11:00:03Z',
    });

    jest.useRealTimers();
  });
});