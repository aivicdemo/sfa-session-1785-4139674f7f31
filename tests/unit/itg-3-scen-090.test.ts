import { deleteExpiredReports } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェント推奨根拠の可視化機能 - 期限切れレポート削除", () => {
  // SCEN-090
  test("削除対象レポートが複数件の場合にすべて正常に削除される", async () => {
    const now = new Date("2026-08-01T12:00:00Z");
    const expiredDate = new Date("2026-05-03T00:00:00Z"); // 現在から90日以上前

    const expiredReports = [
      {
        reportId: "REPORT-001",
        s3ObjectKey: "reports/2025-01/report-001.pdf",
        createdAt: expiredDate,
        createdBy: "user001",
      },
      {
        reportId: "REPORT-002",
        s3ObjectKey: "reports/2025-01/report-002.pdf",
        createdAt: expiredDate,
        createdBy: "user002",
      },
      {
        reportId: "REPORT-003",
        s3ObjectKey: "reports/2025-01/report-003.pdf",
        createdAt: expiredDate,
        createdBy: "user003",
      },
    ];

    const deletedS3Keys: string[] = [];
    const deletedReportIds: string[] = [];

    const mockFileStorageAdapter = {
      deleteExpiredReports: jest.fn(async (reports: typeof expiredReports) => {
        for (const report of reports) {
          deletedS3Keys.push(report.s3ObjectKey);
          deletedReportIds.push(report.reportId);
        }
        return {
          deletedCount: reports.length,
          deletedReports: reports.map((r) => ({
            reportId: r.reportId,
            s3ObjectKey: r.s3ObjectKey,
          })),
          transactionCommitted: true,
        };
      }),
    };

    const result = await deleteExpiredReports(
      expiredReports,
      mockFileStorageAdapter,
      now
    );

    expect(mockFileStorageAdapter.deleteExpiredReports).toHaveBeenCalledTimes(1);
    expect(mockFileStorageAdapter.deleteExpiredReports).toHaveBeenCalledWith(
      expiredReports
    );

    expect(deletedS3Keys).toEqual([
      "reports/2025-01/report-001.pdf",
      "reports/2025-01/report-002.pdf",
      "reports/2025-01/report-003.pdf",
    ]);

    expect(deletedReportIds).toEqual(["REPORT-001", "REPORT-002", "REPORT-003"]);

    expect(result.deletedCount).toBe(3);
    expect(result.transactionCommitted).toBe(true);
    expect(result.deletedReports).toHaveLength(3);
    expect(result.deletedReports[0]).toEqual({
      reportId: "REPORT-001",
      s3ObjectKey: "reports/2025-01/report-001.pdf",
    });
    expect(result.deletedReports[1]).toEqual({
      reportId: "REPORT-002",
      s3ObjectKey: "reports/2025-01/report-002.pdf",
    });
    expect(result.deletedReports[2]).toEqual({
      reportId: "REPORT-003",
      s3ObjectKey: "reports/2025-01/report-003.pdf",
    });
  });
});