import { uploadRecommendationReport } from "../../src/logic/it-1-br-3-2-1-1";

describe("AIエージェント推奨内容の根拠表示機能", () => {
  test("SCEN-239: 推奨内容が null のとき、レポート生成処理がエラーをスロー", () => {
    const mockFileStorageAdapter = {
      uploadRecommendationReport: jest.fn(),
      generateDownloadUrl: jest.fn(),
      deleteExpiredReports: jest.fn(),
    };

    expect(() =>
      uploadRecommendationReport(null, mockFileStorageAdapter)
    ).toThrow(/推奨内容/);

    expect(mockFileStorageAdapter.uploadRecommendationReport).not.toHaveBeenCalled();
  });
});