import { deleteExpiredReports } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェントの推奨根拠の可視化機能", () => {
  test("SCEN-777: FileStorageAdapter.deleteExpiredReports が呼び出されたとき、有効期限切れのレポートが削除される", async () => {
    // テスト用の固定時刻（現在時刻の参照点）
    const currentTime = new Date("2024-12-15T12:00:00Z");

    // Amazon S3 deleteObject メソッドのスタブ化
    const deletedFileKeys: string[] = [];
    const s3DeleteStub = jest.fn(async (fileKey: string) => {
      deletedFileKeys.push(fileKey);
      return { success: true };
    });

    // レポートファイルメタデータテーブルのモック
    // 有効期限切れのレコード1: report-001（30日前に期限切れ）
    const expiredReport001 = {
      fileId: "report-001",
      fileName: "recommendation_report_001.pdf",
      expiryDate: new Date("2024-11-15T12:00:00Z"),
      createdAt: new Date("2024-10-15T12:00:00Z"),
      s3BucketKey: "reports/report-001",
    };

    // 有効期限切れのレコード2: report-002（1時間前に期限切れ）
    const expiredReport002 = {
      fileId: "report-002",
      fileName: "recommendation_report_002.pdf",
      expiryDate: new Date("2024-12-15T11:00:00Z"),
      createdAt: new Date("2024-12-01T12:00:00Z"),
      s3BucketKey: "reports/report-002",
    };

    // 有効期限内のレコード: report-003（1時間後まで有効）
    const validReport003 = {
      fileId: "report-003",
      fileName: "recommendation_report_003.pdf",
      expiryDate: new Date("2024-12-15T13:00:00Z"),
      createdAt: new Date("2024-12-08T12:00:00Z"),
      s3BucketKey: "reports/report-003",
    };

    // データベースに格納されたレコード
    const reportMetadataRecords = [
      expiredReport001,
      expiredReport002,
      validReport003,
    ];

    // FileStorageAdapter のモック
    const fileStorageAdapterStub = {
      deleteObject: s3DeleteStub,
      getReportMetadata: jest.fn(async () => reportMetadataRecords),
      removeMetadataRecord: jest.fn(async (fileId: string) => {
        const index = reportMetadataRecords.findIndex(
          (r) => r.fileId === fileId
        );
        if (index > -1) {
          reportMetadataRecords.splice(index, 1);
        }
      }),
    };

    // deleteExpiredReports メソッドを呼び出し
    const result = await deleteExpiredReports(
      fileStorageAdapterStub,
      currentTime
    );

    // S3 の deleteObject メソッドが report-001 と report-002 で呼び出されたことを検証
    expect(deletedFileKeys).toContain("reports/report-001");
    expect(deletedFileKeys).toContain("reports/report-002");
    expect(deletedFileKeys.length).toBe(2);

    // s3DeleteStub が正確に2回呼び出されたことを検証
    expect(s3DeleteStub).toHaveBeenCalledTimes(2);
    expect(s3DeleteStub).toHaveBeenCalledWith("reports/report-001");
    expect(s3DeleteStub).toHaveBeenCalledWith("reports/report-002");

    // removeMetadataRecord が report-001 と report-002 で呼び出されたことを検証
    expect(fileStorageAdapterStub.removeMetadataRecord).toHaveBeenCalledTimes(
      2
    );
    expect(
      fileStorageAdapterStub.removeMetadataRecord
    ).toHaveBeenCalledWith("report-001");
    expect(
      fileStorageAdapterStub.removeMetadataRecord
    ).toHaveBeenCalledWith("report-002");

    // report-001 と report-002 がデータベースから物理削除されていることを確認
    const remainingRecords = reportMetadataRecords;
    expect(remainingRecords.length).toBe(1);
    expect(remainingRecords[0].fileId).toBe("report-003");

    // report-003 が削除されていないことを確認
    const report003Exists = remainingRecords.some(
      (r) => r.fileId === "report-003"
    );
    expect(report003Exists).toBe(true);

    // 戻り値の検証（削除されたレポートのファイルID）
    expect(result).toEqual({
      deletedReportCount: 2,
      deletedFileIds: ["report-001", "report-002"],
    });
  });
});