import { deleteExpiredReports } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェントの推奨根拠の可視化機能 - 期限切レポート自動削除", () => {
  test("SCEN-1000: レポートメタデータが null のとき削除処理がスキップされ警告が返される", () => {
    const mockFileStorageAdapter = {
      deleteExpiredReports: jest.fn(),
    };

    const result = deleteExpiredReports(null, mockFileStorageAdapter);

    expect(result.status).toBe("warning");
    expect(result.errorCode).toBe("METADATA_NULL_ERROR");
    expect(result.warningMessage).toBe(
      "レポートメタデータが取得できません。削除処理をスキップします"
    );
    expect(mockFileStorageAdapter.deleteExpiredReports).not.toHaveBeenCalled();
  });
});