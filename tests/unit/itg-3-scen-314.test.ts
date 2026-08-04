import { deleteExpiredReports } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェントの推奨根拠の可視化機能", () => {
  // SCEN-314
  test("期限切れレポートの自動削除機能 - 削除対象の期限切れレポートが1件のとき、そのレポートが削除される", async () => {
    const now = new Date("2026-02-15T10:00:00Z");
    const thirtyDaysAgo = new Date("2026-01-16T10:00:00Z");
    const fiveDaysAgo = new Date("2026-02-10T10:00:00Z");

    const expiredReportMetadata = {
      reportId: "report-001",
      createdAt: thirtyDaysAgo,
      storagePath: "s3://bucket/report-001.pdf",
    };

    const validReportMetadata = {
      reportId: "report-002",
      createdAt: fiveDaysAgo,
      storagePath: "s3://bucket/report-002.pdf",
    };

    const mockDeleteCalls: string[] = [];
    const mockFileStorageAdapter = {
      delete: jest.fn((path: string) => {
        mockDeleteCalls.push(path);
        return Promise.resolve();
      }),
    };

    const mockReportMetadataTable = [expiredReportMetadata, validReportMetadata];

    const result = await deleteExpiredReports(
      mockFileStorageAdapter,
      mockReportMetadataTable,
      now,
      30
    );

    expect(mockFileStorageAdapter.delete).toHaveBeenCalledWith(
      "s3://bucket/report-001.pdf"
    );
    expect(mockFileStorageAdapter.delete).toHaveBeenCalledTimes(1);
    expect(mockDeleteCalls).toEqual(["s3://bucket/report-001.pdf"]);

    expect(result).toContainEqual({
      reportId: "report-002",
      createdAt: fiveDaysAgo,
      storagePath: "s3://bucket/report-002.pdf",
    });

    expect(
      result.find((r: any) => r.reportId === "report-001")
    ).toBeUndefined();
    expect(result).toHaveLength(1);
  });
});