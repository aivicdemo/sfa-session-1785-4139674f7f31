import { uploadRecommendationReportWithRetry } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能 - レポート生成・ファイル保存', () => {
  // SCEN-2742
  test('Amazon S3へのアップロードが失敗したとき最大2回まで再試行される', async () => {
    jest.useFakeTimers();

    const mockFileStorageAdapter = {
      uploadRecommendationReport: jest.fn(),
    };

    const reportData = {
      recommendationId: 'rec-12345',
      customerId: 'cust-67890',
      proposalApproach: 'アプローチA',
      successPattern: 'パターンX',
      confidence: 85,
      reasoning: '過去の成功事例から推奨',
      generatedAt: new Date('2024-01-15T10:00:00Z'),
    };

    // 第1回目：失敗、第2回目：失敗、第3回目：成功
    mockFileStorageAdapter.uploadRecommendationReport
      .mockRejectedValueOnce(new Error('S3 upload failed'))
      .mockRejectedValueOnce(new Error('S3 upload failed'))
      .mockResolvedValueOnce({
        fileUrl: 'https://s3.amazonaws.com/reports/rec-12345.pdf',
        uploadedAt: new Date('2024-01-15T10:00:13Z'),
      });

    const resultPromise = uploadRecommendationReportWithRetry(
      reportData,
      mockFileStorageAdapter
    );

    // 第1回目の呼び出しを確認
    expect(mockFileStorageAdapter.uploadRecommendationReport).toHaveBeenCalledTimes(1);

    // 3秒後に第1回目再試行をトリガー
    jest.advanceTimersByTime(3000);
    await jest.runOnlyPendingTimersAsync();

    expect(mockFileStorageAdapter.uploadRecommendationReport).toHaveBeenCalledTimes(2);

    // 10秒後に第2回目再試行をトリガー
    jest.advanceTimersByTime(10000);
    await jest.runOnlyPendingTimersAsync();

    expect(mockFileStorageAdapter.uploadRecommendationReport).toHaveBeenCalledTimes(3);

    const result = await resultPromise;

    // 最終的に3回呼び出されたことを確認
    expect(mockFileStorageAdapter.uploadRecommendationReport).toHaveBeenCalledTimes(3);

    // すべての呼び出しで reportData が渡されたことを確認
    expect(mockFileStorageAdapter.uploadRecommendationReport).toHaveBeenNthCalledWith(
      1,
      reportData
    );
    expect(mockFileStorageAdapter.uploadRecommendationReport).toHaveBeenNthCalledWith(
      2,
      reportData
    );
    expect(mockFileStorageAdapter.uploadRecommendationReport).toHaveBeenNthCalledWith(
      3,
      reportData
    );

    // 最終結果の確認
    expect(result).toEqual({
      fileUrl: 'https://s3.amazonaws.com/reports/rec-12345.pdf',
      uploadedAt: new Date('2024-01-15T10:00:13Z'),
    });

    jest.useRealTimers();
  });
});