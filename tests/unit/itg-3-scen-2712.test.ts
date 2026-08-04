import { describe, test, expect, beforeEach, afterEach } from "@jest/globals";

describe("FileStorageAdapter.deleteExpiredReports - 削除対象0件時の正常終了", () => {
  let mockS3Client: any;
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    mockS3Client = {
      listObjectsV2: jest.fn(),
      deleteObject: jest.fn(),
    };
    consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();
  });

  afterEach(() => {
    jest.clearAllMocks();
    consoleErrorSpy.mockRestore();
  });

  // SCEN-2712
  test("deleteExpiredReportsが0件を削除したとき、処理は正常終了する", async () => {
    const { deleteExpiredReports } = await import(
      "../../src/logic/it-1-br-3-1-1-1"
    );

    mockS3Client.listObjectsV2.mockResolvedValueOnce({
      Contents: [],
    });

    const result = await deleteExpiredReports(mockS3Client, {
      bucketName: "test-bucket",
      expirationDays: 30,
    });

    expect(result).toEqual({
      deletedCount: 0,
      success: true,
    });

    expect(mockS3Client.deleteObject).not.toHaveBeenCalled();
    expect(mockS3Client.deleteObject).toHaveBeenCalledTimes(0);

    expect(consoleErrorSpy).not.toHaveBeenCalled();
  });
});