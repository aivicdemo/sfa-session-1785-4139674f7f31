import { generateDownloadUrl } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェント推奨根拠の可視化機能 - ダウンロードURL生成", () => {
  // SCEN-999
  test("FileStorageAdapterのgenerateDownloadUrlがAPIエラーを返すとき、エラーメッセージが返される", async () => {
    const mockStorageAdapter = {
      generateDownloadUrl: jest.fn().mockRejectedValueOnce(
        new Error("The specified key does not exist.")
      ),
    };

    const reportFileKey = "reports/recommendation_20260801_abc123.pdf";

    try {
      await generateDownloadUrl(mockStorageAdapter, reportFileKey);
      fail("Should have thrown an error");
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect((error as Error).message).toMatch(/The specified key does not exist/);
    }

    expect(mockStorageAdapter.generateDownloadUrl).toHaveBeenCalledWith(
      reportFileKey
    );
  });
});