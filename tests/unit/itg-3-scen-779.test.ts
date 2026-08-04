import { describe, test, expect, jest, beforeEach, afterEach } from "@jest/globals";

// Mock implementations
interface RecommendationReport {
  id: string;
  content: string;
  generatedAt: string;
}

interface FileStorageAdapter {
  uploadRecommendationReport: (
    report: RecommendationReport
  ) => Promise<{ url: string; uploadedAt: string }>;
}

class ServiceUnavailableException extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ServiceUnavailableException";
  }
}

// Target logic function
async function generateAndSaveRecommendationReport(
  report: RecommendationReport,
  fileStorageAdapter: FileStorageAdapter
): Promise<{ success: boolean; url?: string; message?: string }> {
  const MAX_RETRIES = 2;
  const RETRY_DELAY_MS = 10000;

  let lastError: Error | null = null;
  let uploadAttempt = 0;

  const attemptUpload = async (): Promise<{
    success: boolean;
    url?: string;
    message?: string;
  }> => {
    try {
      uploadAttempt++;
      const result = await fileStorageAdapter.uploadRecommendationReport(
        report
      );
      return {
        success: true,
        url: result.url,
        message: `レポートが正常に保存されました (試行回数: ${uploadAttempt})`,
      };
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      if (
        uploadAttempt < MAX_RETRIES + 1 &&
        lastError.name === "ServiceUnavailableException"
      ) {
        await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS));
        return attemptUpload();
      }
      return {
        success: false,
        message: `レポート保存に失敗しました: ${lastError.message}`,
      };
    }
  };

  return attemptUpload();
}

describe("AIエージェント推奨根拠の可視化機能 - ファイルストレージ失敗時の再試行", () => {
  let mockFileStorageAdapter: FileStorageAdapter;
  let uploadCallTimes: number[] = [];
  let callCount: number = 0;

  beforeEach(() => {
    uploadCallTimes = [];
    callCount = 0;

    mockFileStorageAdapter = {
      uploadRecommendationReport: jest.fn(
        async (report: RecommendationReport) => {
          callCount++;
          uploadCallTimes.push(Date.now());

          // 1回目の呼び出しは成功
          if (callCount === 1) {
            return {
              url: "https://s3.example.com/reports/rec-001.pdf",
              uploadedAt: new Date("2024-01-15T11:00:00Z").toISOString(),
            };
          }

          // 2回目の呼び出しは失敗
          if (callCount === 2) {
            throw new ServiceUnavailableException(
              "ファイルストレージサービスが一時的に利用不可です"
            );
          }

          // 3回目以降は成功
          return {
            url: "https://s3.example.com/reports/rec-001-retry.pdf",
            uploadedAt: new Date("2024-01-15T11:00:10Z").toISOString(),
          };
        }
      ) as jest.MockedFunction<
        (report: RecommendationReport) => Promise<{
          url: string;
          uploadedAt: string;
        }>
      >,
    };

    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  // SCEN-779
  test("推奨レポート生成・保存機能でファイルストレージが2回目で失敗した場合、10秒後に自動再試行され、3回目の呼び出しで成功すること", async () => {
    const testReport: RecommendationReport = {
      id: "rec-779-001",
      content: "顧客A社への最適購買タイミング推奨: 2024年Q2",
      generatedAt: new Date("2024-01-15T11:00:00Z").toISOString(),
    };

    // 非同期処理を開始
    const resultPromise = generateAndSaveRecommendationReport(
      testReport,
      mockFileStorageAdapter
    );

    // 1回目の呼び出しが完了するまで待機
    await jest.runOnlyPendingTimersAsync();
    expect(callCount).toBe(1);
    expect(uploadCallTimes).toHaveLength(1);

    // 2回目の呼び出しをトリガー（テストシナリオの同一レポートに対する2回目呼び出し）
    const secondAttempt = generateAndSaveRecommendationReport(
      testReport,
      mockFileStorageAdapter
    );

    await jest.runOnlyPendingTimersAsync();
    expect(callCount).toBe(2);

    // 2回目の呼び出しが失敗したことを確認
    const mockFn = mockFileStorageAdapter.uploadRecommendationReport as jest.MockedFunction<
      (report: RecommendationReport) => Promise<{
        url: string;
        uploadedAt: string;
      }>
    >;
    expect(mockFn).toHaveBeenCalledTimes(2);

    // 失敗時点のタイムスタンプを記録
    const failureTime = uploadCallTimes[1];

    // 再試行メカニズムが10秒後に実行されることを確認するため、タイマーを進める
    jest.advanceTimersByTime(10000);

    // 再試行が実行されるまで待機
    const result = await secondAttempt;

    // 再試行の呼び出しが成功したことを確認
    expect(callCount).toBe(3);
    expect(mockFn).toHaveBeenCalledTimes(3);

    // 3回目の呼び出しが成功したことを検証
    expect(result.success).toBe(true);
    expect(result.url).toBe("https://s3.example.com/reports/rec-001-retry.pdf");
    expect(result.message).toMatch(/正常に保存されました/);

    // 再試行の呼び出し時刻が失敗時刻から正確に10秒後であることを検証
    expect(uploadCallTimes).toHaveLength(3);
    const retryTime = uploadCallTimes[2];
    const timeDifference = retryTime - failureTime;

    // 10秒（10000ms）のディレイを確認（フェイクタイマーでの実行なので完全に正確）
    expect(timeDifference).toBe(10000);

    // 再試行回数が最大2回の制約内に収まっていることを確認
    expect(callCount).toBeLessThanOrEqual(3);
    expect(mockFn).toHaveBeenCalledTimes(3);
  });
});