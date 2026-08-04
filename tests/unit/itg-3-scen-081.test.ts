import { generateDownloadUrl } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェント推奨根拠の可視化 - ダウンロードURL生成機能", () => {
  // SCEN-081
  test("レポートメタデータが0件の場合、空のダウンロードURLリストが正常に返される", () => {
    const mockFileStorageAdapter = {
      generateDownloadUrl: jest.fn().mockResolvedValue({
        urls: [],
        message: "利用可能なレポートがありません",
        statusCode: 0,
      }),
    };

    const reportMetadata: Array<{
      id: string;
      fileName: string;
      createdAt: string;
    }> = [];

    const result = generateDownloadUrl(reportMetadata, mockFileStorageAdapter);

    return result.then((response: any) => {
      expect(response.urls).toEqual([]);
      expect(response.message).toBe("利用可能なレポートがありません");
      expect(response.statusCode).toBe(0);
      expect(mockFileStorageAdapter.generateDownloadUrl).toHaveBeenCalledTimes(
        1
      );
    });
  });
});