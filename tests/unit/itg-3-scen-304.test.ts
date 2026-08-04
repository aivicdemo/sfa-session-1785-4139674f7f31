import { describe, test, expect, jest, beforeEach, afterEach } from "@jest/globals";
import { generateRecommendationReportWithRetry } from "../../src/logic/it-1-br-3-1-1-1";

const mockFileStorageAdapter = {
  uploadRecommendationReport: jest.fn(),
  generateDownloadUrl: jest.fn(),
  deleteExpiredReports: jest.fn(),
};

describe("AIエージェントの推奨根拠の可視化機能", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  // SCEN-304
  test("推奨内容のレポート生成・アップロード機能 - Amazon S3アップロード失敗後、最初の再試行（3秒待機）で成功", async () => {
    const recommendationContent = {
      recommendationId: "rec-2024-001",
      customerId: "cust-12345",
      dealId: "deal-67890",
      proposalApproach: "提案アプローチA",
      successPatterns: ["パターン1", "パターン2"],
      confidenceScore: 87,
      rationale: "過去の類似案件で80%以上の成功率を記録",
      timing: "2024-01-20T14:30:00Z",
      nextActions: ["顧客へのメール送付", "フォローアップ架電"],
    };

    const expectedTimestamp = "2024-01-15T11:00:00Z";
    const expectedFileName = `recommendations-${expectedTimestamp.replace(/[-:]/g, "").replace("T", "-").substring(0, 15)}.pdf`;
    const expectedS3Path = `recommendations/${expectedFileName}`;
    const expectedDownloadUrl =
      `https://s3.amazonaws.com/sales-ai-bucket/${expectedS3Path}?expires=3600`;
    const expectedExpirationTime = new Date(
      new Date(expectedTimestamp).getTime() + 3600 * 1000
    ).toISOString();

    // 1回目のアップロード呼び出しで失敗を設定
    mockFileStorageAdapter.uploadRecommendationReport.mockRejectedValueOnce(
      new Error("NetworkError: Connection timeout")
    );

    // 2回目のアップロード呼び出しで成功を設定
    mockFileStorageAdapter.uploadRecommendationReport.mockResolvedValueOnce({
      fileName: expectedFileName,
      s3Path: expectedS3Path,
      downloadUrl: expectedDownloadUrl,
      uploadedAt: expectedTimestamp,
    });

    const result = await generateRecommendationReportWithRetry(
      recommendationContent,
      mockFileStorageAdapter,
      expectedTimestamp
    );

    // 1回目のアップロード失敗を確認
    expect(mockFileStorageAdapter.uploadRecommendationReport).toHaveBeenCalledTimes(1);

    // 3秒待機を進める
    jest.advanceTimersByTime(3000);

    // 2回目のアップロード呼び出しを待つ
    await new Promise((resolve) => setTimeout(resolve, 0));

    // 2回目のアップロード成功を確認
    expect(mockFileStorageAdapter.uploadRecommendationReport).toHaveBeenCalledTimes(2);

    // レポートメタデータが正しく作成されたことを確認
    expect(result).toEqual({
      status: "success",
      message: "レポートが正常にアップロードされました",
      reportMetadata: {
        fileName: expectedFileName,
        s3Path: expectedS3Path,
        downloadUrl: expectedDownloadUrl,
        uploadedAt: expectedTimestamp,
        expiresAt: expectedExpirationTime,
        retryCount: 1,
        retryAttemptTimes: [3000],
      },
    });

    // ファイル名形式の確認（ISO8601タイムスタンプを含むこと）
    expect(result.reportMetadata.fileName).toMatch(/^recommendations-\d{15}\.pdf$/);

    // 有効期限が1時間後であることを確認
    const uploadTime = new Date(expectedTimestamp).getTime();
    const expirationTime = new Date(result.reportMetadata.expiresAt).getTime();
    expect(expirationTime - uploadTime).toBe(3600 * 1000);

    // エラーメッセージが表示されていないことを確認
    expect(result.message).not.toMatch(
      /一時的な遅延が発生しています|推奨の生成に失敗|エラー/
    );
  });
});