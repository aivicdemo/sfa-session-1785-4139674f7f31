import { generateRecommendationReport } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェントの推奨根拠の可視化機能", () => {
  // SCEN-695: [edge] 推奨内容のレポート生成・保存機能 - レポート生成時、0件の推奨内容が入力された場合、空のレポートが生成される
  test("should generate empty report with zero recommendations and upload successfully", async () => {
    const mockFileStorageAdapter = {
      uploadRecommendationReport: jest.fn().mockResolvedValue({
        fileKey: "report_20240115_000001",
        uploadedAt: "2024-01-15T11:00:00Z",
        downloadUrl: "https://s3.amazonaws.com/bucket/report_20240115_000001.pdf",
      }),
      generateDownloadUrl: jest.fn(),
      deleteExpiredReports: jest.fn(),
    };

    const userId = "user_12345";
    const recommendations: Array<{
      recommendationId: string;
      content: string;
      confidence: number;
    }> = [];
    const reportFormat = "PDF";
    const expectedGeneratedAt = new Date("2024-01-15T11:00:00Z");
    const expectedMinimalPdfSize = 100;
    const expectedRecommendationCount = 0;

    const result = await generateRecommendationReport(
      recommendations,
      reportFormat,
      userId,
      mockFileStorageAdapter
    );

    expect(result).toEqual({
      reportId: expect.any(String),
      fileKey: "report_20240115_000001",
      fileName: expect.stringContaining(".pdf"),
      fileFormat: "PDF",
      recommendationCount: expectedRecommendationCount,
      generatedAt: expect.any(String),
      uploadedAt: "2024-01-15T11:00:00Z",
      userId: userId,
      downloadUrl: "https://s3.amazonaws.com/bucket/report_20240115_000001.pdf",
      fileSize: expect.any(Number),
      status: "completed",
    });

    expect(result.recommendationCount).toBe(expectedRecommendationCount);
    expect(result.fileFormat).toBe("PDF");
    expect(result.userId).toBe(userId);
    expect(result.status).toBe("completed");
    expect(result.fileSize).toBeGreaterThanOrEqual(expectedMinimalPdfSize);

    expect(mockFileStorageAdapter.uploadRecommendationReport).toHaveBeenCalledTimes(1);
    expect(
      mockFileStorageAdapter.uploadRecommendationReport
    ).toHaveBeenCalledWith(
      expect.objectContaining({
        fileFormat: "PDF",
        recommendations: [],
        userId: userId,
      })
    );

    const uploadCallArgs =
      mockFileStorageAdapter.uploadRecommendationReport.mock.calls[0][0];
    expect(uploadCallArgs.recommendations).toHaveLength(0);
    expect(uploadCallArgs.fileFormat).toBe("PDF");
  });
});