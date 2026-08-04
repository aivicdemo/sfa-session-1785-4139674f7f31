import { generateRecommendationReportWithRetry } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェントの推奨根拠の可視化機能", () => {
  // SCEN-689
  test("推奨内容のレポート生成・保存機能 - Amazon S3へのアップロードが1回目のみ失敗した場合、指数バックオフ再試行後にダウンロードURL生成が完了する", async () => {
    const mockFileStorageAdapter = {
      uploadRecommendationReport: jest.fn(),
      generateDownloadUrl: jest.fn(),
      deleteExpiredReports: jest.fn(),
    };

    const s3ObjectKeyOnSuccess = "report-2024-01-15-abc123def456";
    const downloadUrlWithExpiration =
      "https://bucket.s3.amazonaws.com/report-2024-01-15-abc123def456?X-Amz-Expires=3600";

    mockFileStorageAdapter.uploadRecommendationReport
      .mockRejectedValueOnce(
        new Error("503 Service Unavailable"),
      )
      .mockResolvedValueOnce(s3ObjectKeyOnSuccess);

    mockFileStorageAdapter.generateDownloadUrl.mockResolvedValueOnce(
      downloadUrlWithExpiration,
    );

    const recommendationInput = {
      customerId: "CUST-20240115-001",
      dealId: "DEAL-20240115-001",
      recommendationContent: {
        proposalApproach: "顧客のIT投資計画に基づいた段階的提案",
        confidenceScore: 85,
        successPatternRef: "PATTERN-2023-Q4-SUCCESS-001",
      },
      recommendationReasoning: {
        similarCaseCount: 5,
        matchingFactor: 0.92,
        customerSegment: "大規模製造業",
      },
    };

    const result = await generateRecommendationReportWithRetry(
      recommendationInput,
      mockFileStorageAdapter,
    );

    expect(mockFileStorageAdapter.uploadRecommendationReport).toHaveBeenCalledTimes(
      2,
    );
    expect(mockFileStorageAdapter.uploadRecommendationReport).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        customerId: "CUST-20240115-001",
        dealId: "DEAL-20240115-001",
      }),
    );
    expect(mockFileStorageAdapter.uploadRecommendationReport).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        customerId: "CUST-20240115-001",
        dealId: "DEAL-20240115-001",
      }),
    );

    expect(mockFileStorageAdapter.generateDownloadUrl).toHaveBeenCalledTimes(1);
    expect(mockFileStorageAdapter.generateDownloadUrl).toHaveBeenCalledWith(
      s3ObjectKeyOnSuccess,
    );

    expect(result).toEqual({
      status: "success",
      downloadUrl: downloadUrlWithExpiration,
      s3ObjectKey: s3ObjectKeyOnSuccess,
      retryAttempts: 1,
    });
  });
});