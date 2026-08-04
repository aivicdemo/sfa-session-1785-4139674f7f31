import { jest } from "@jest/globals";
import { uploadRecommendationReportWithRetry } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェント推奨支援システム - S3アップロード再試行ロジック", () => {
  // SCEN-109
  test("Amazon S3アップロード失敗時に最大2回の再試行が実行される", async () => {
    const mockFileStorageAdapter = {
      uploadRecommendationReport: jest.fn(),
    };

    const reportData = {
      reportId: "rpt-001",
      reportName: "recommendation_report_2024.pdf",
      reportFormat: "PDF",
      content: Buffer.from("test pdf content"),
      uploadedAt: new Date("2024-01-15T11:00:00Z"),
    };

    const mockMetadata = {
      metadataId: "meta-001",
      reportId: "rpt-001",
      s3Bucket: "recommendation-reports",
      s3Key: "reports/rpt-001/recommendation_report_2024.pdf",
      fileSize: 1024,
      uploadStatus: "SUCCESS",
      uploadedTimestamp: new Date("2024-01-15T11:00:15Z"),
      retryCount: 2,
    };

    // 初回呼び出し: NetworkError
    mockFileStorageAdapter.uploadRecommendationReport.mockRejectedValueOnce(
      new Error("NetworkError: Connection timeout")
    );

    // 第1回目再試行: NetworkError
    mockFileStorageAdapter.uploadRecommendationReport.mockRejectedValueOnce(
      new Error("NetworkError: Connection timeout")
    );

    // 第2回目再試行: 成功
    mockFileStorageAdapter.uploadRecommendationReport.mockResolvedValueOnce(
      mockMetadata
    );

    const result = await uploadRecommendationReportWithRetry(
      reportData,
      mockFileStorageAdapter
    );

    // 再試行回数の検証: 初回1回 + 再試行2回 = 合計3回
    expect(mockFileStorageAdapter.uploadRecommendationReport).toHaveBeenCalledTimes(3);

    // 第2回目再試行で成功したため、メタデータが正常に記録されている
    expect(result).toEqual(mockMetadata);
    expect(result.uploadStatus).toBe("SUCCESS");
    expect(result.retryCount).toBe(2);

    // 呼び出し順序の検証
    expect(
      mockFileStorageAdapter.uploadRecommendationReport
    ).toHaveBeenNthCalledWith(1, reportData);
    expect(
      mockFileStorageAdapter.uploadRecommendationReport
    ).toHaveBeenNthCalledWith(2, reportData);
    expect(
      mockFileStorageAdapter.uploadRecommendationReport
    ).toHaveBeenNthCalledWith(3, reportData);
  });
});