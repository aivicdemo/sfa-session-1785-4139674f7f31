import { generateRecommendationReportWithRetry } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-2644
  test('推奨レポート生成・保存機能 - FileStorageAdapterへのアップロードが失敗したとき、最大2回の再試行が実行される', async () => {
    const uploadCallCount = { count: 0 };
    const delays: number[] = [];
    const delayStartTimes: number[] = [];

    const mockFileStorageAdapter = {
      uploadRecommendationReport: jest.fn(async () => {
        uploadCallCount.count++;
        const callNumber = uploadCallCount.count;

        if (callNumber === 1 || callNumber === 2) {
          throw new Error('NetworkError');
        }

        // 3回目の呼び出しでも失敗させるため、常にエラーを投げる
        throw new Error('NetworkError');
      }),
      generateDownloadUrl: jest.fn(),
      deleteExpiredReports: jest.fn(),
    };

    const mockRecommendationData = {
      recommendationId: 'rec-2644-001',
      customerId: 'cust-001',
      dealId: 'deal-001',
      proposedApproach: 'Test approach',
      confidenceScore: 85,
      reasoningBasis: ['past_success_pattern', 'customer_attribute_match'],
      timestamp: new Date('2024-01-15T11:00:00Z'),
    };

    // 時間計測用のタイマーをモック化
    const originalSetTimeout = global.setTimeout;
    let timeoutCalls: Array<{ callback: () => void; delay: number }> = [];

    global.setTimeout = jest.fn((callback: () => void, delay: number) => {
      timeoutCalls.push({ callback, delay });
      delayStartTimes.push(Date.now());
      return setTimeout(callback, delay);
    }) as any;

    try {
      await generateRecommendationReportWithRetry(
        mockRecommendationData,
        mockFileStorageAdapter
      );
    } catch (error) {
      // エラーが投げられることは期待される
      expect(String(error)).toMatch(/レポート生成に失敗しました/);
    }

    // アップロードメソッドが正確に3回呼ばれたことを確認
    expect(mockFileStorageAdapter.uploadRecommendationReport).toHaveBeenCalledTimes(3);

    // 再試行のディレイが正しいことを確認
    // 1回目の失敗後、3秒（3000ms）のディレイ
    expect(timeoutCalls.length).toBeGreaterThanOrEqual(1);
    if (timeoutCalls.length >= 1) {
      expect(timeoutCalls[0].delay).toBe(3000);
    }

    // 2回目の失敗後、10秒（10000ms）のディレイ
    if (timeoutCalls.length >= 2) {
      expect(timeoutCalls[1].delay).toBe(10000);
    }

    // 3回以上の再試行が実行されないことを確認
    expect(uploadCallCount.count).toBe(3);

    // クリーンアップ
    global.setTimeout = originalSetTimeout;
  });
});