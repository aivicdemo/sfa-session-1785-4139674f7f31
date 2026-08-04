import { deleteExpiredReports } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェント推奨根拠の可視化機能 - 期限切れレポート削除", () => {
  // SCEN-087
  test("should delete expired reports older than 90 days and keep recent ones", async () => {
    const now = new Date("2026-08-29T00:00:00Z");
    const ninetyDaysAgo = new Date("2026-05-31T00:00:00Z");
    const thirtyDaysAgo = new Date("2026-07-30T00:00:00Z");

    const expiredReports = [
      {
        id: "meta_001",
        fileKey: "report_old_001.pdf",
        createdAt: new Date("2026-05-01T10:00:00Z"),
      },
      {
        id: "meta_002",
        fileKey: "report_old_002.xlsx",
        createdAt: new Date("2026-05-15T14:30:00Z"),
      },
      {
        id: "meta_003",
        fileKey: "report_old_003.pdf",
        createdAt: new Date("2026-05-28T09:15:00Z"),
      },
    ];

    const recentReports = [
      {
        id: "meta_004",
        fileKey: "report_new_001.pdf",
        createdAt: new Date("2026-07-20T11:00:00Z"),
      },
      {
        id: "meta_005",
        fileKey: "report_new_002.xlsx",
        createdAt: new Date("2026-07-25T16:45:00Z"),
      },
    ];

    const mockFileStorageAdapter = {
      deleteExpiredReports: jest.fn().mockResolvedValue({
        deletedKeys: [
          "report_old_001.pdf",
          "report_old_002.xlsx",
          "report_old_003.pdf",
        ],
        deletedCount: 3,
      }),
    };

    const result = await deleteExpiredReports(
      {
        expiredReports,
        recentReports,
        currentDate: now,
        thresholdDays: 90,
      },
      mockFileStorageAdapter
    );

    expect(result.deletedCount).toBe(3);
    expect(result.remainingCount).toBe(2);
    expect(result.deletedFileKeys).toEqual([
      "report_old_001.pdf",
      "report_old_002.xlsx",
      "report_old_003.pdf",
    ]);

    expect(mockFileStorageAdapter.deleteExpiredReports).toHaveBeenCalledTimes(
      1
    );
    expect(mockFileStorageAdapter.deleteExpiredReports).toHaveBeenCalledWith({
      fileKeysToDelete: [
        "report_old_001.pdf",
        "report_old_002.xlsx",
        "report_old_003.pdf",
      ],
      thresholdDays: 90,
      currentDate: now,
    });
  });
});