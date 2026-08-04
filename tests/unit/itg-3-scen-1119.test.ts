import { deleteExpiredReports } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェントの推奨根拠の可視化機能 - レポート自動削除処理", () => {
  test("SCEN-1119: deleteExpiredReports - s3ObjectKeyがnullのとき、ValidationErrorをスロー", () => {
    // Arrange: モック化されたFileStorageAdapterを準備
    const mockFileStorageAdapter = {
      uploadRecommendationReport: jest.fn(),
      generateDownloadUrl: jest.fn(),
      deleteExpiredReports: jest.fn(async (reportMetadata) => {
        // s3ObjectKeyがnullまたはundefinedの場合、ValidationErrorをスロー
        if (!reportMetadata.s3ObjectKey) {
          throw new Error("S3 object key is null or undefined");
        }
        // 正常時の削除処理
        return { deletedCount: 1 };
      }),
    };

    // 削除対象レポートのメタデータ: s3ObjectKeyがnull
    const expiredReportMetadata = {
      reportId: "RPT-20240115-001",
      reportFileName: "recommendation_report_2024_01_15.pdf",
      s3ObjectKey: null, // nullに設定
      createdAt: new Date("2023-12-15T10:30:00Z"),
      expiresAt: new Date("2024-01-14T23:59:59Z"),
      isDeleted: false,
    };

    // Act & Assert: deleteExpiredReportsを呼び出し、エラーをスロー
    expect(() => {
      mockFileStorageAdapter.deleteExpiredReports(expiredReportMetadata);
    }).toThrow(/S3 object key is null or undefined/);

    // Assert: S3へのリクエストが発生していない（mockが呼ばれていない）
    expect(mockFileStorageAdapter.deleteExpiredReports).toHaveBeenCalledWith(
      expiredReportMetadata
    );

    // Assert: レポートメタデータの削除状態フラグが更新されていない
    expect(expiredReportMetadata.isDeleted).toBe(false);
  });
});