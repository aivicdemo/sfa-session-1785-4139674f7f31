import { uploadRecommendationReport } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェントの推奨根拠の可視化機能", () => {
  // SCEN-305
  test("推奨内容のレポート生成・アップロード機能 - Amazon S3アップロード失敗後、2回目の再試行（10秒待機）でも失敗したとき、HTML形式表示にフォールバックされる", async () => {
    const mockFileStorageAdapter = {
      uploadRecommendationReport: jest.fn(),
      generateDownloadUrl: jest.fn(),
      deleteExpiredReports: jest.fn(),
    };

    let callCount = 0;
    const timings: number[] = [];
    const startTime = Date.now();

    mockFileStorageAdapter.uploadRecommendationReport.mockImplementation(
      async () => {
        callCount++;
        const currentTime = Date.now() - startTime;
        timings.push(currentTime);

        if (callCount === 1) {
          throw new Error("Network timeout");
        } else if (callCount === 2) {
          throw new Error("Connection refused");
        }
      }
    );

    const recommendationReport = {
      customerName: "テスト顧客A",
      proposalApproach: "提案内容テキスト",
      reasoningBasis: ["根拠1", "根拠2", "根拠3"],
    };

    const result = await uploadRecommendationReport(
      recommendationReport,
      mockFileStorageAdapter
    );

    expect(mockFileStorageAdapter.uploadRecommendationReport).toHaveBeenCalledTimes(
      2
    );

    expect(callCount).toBe(2);

    expect(timings[1] - timings[0]).toBeGreaterThanOrEqual(10000);

    expect(result.format).toBe("html");
    expect(result.content).toContain("<h2>テスト顧客A</h2>");
    expect(result.content).toContain("<p>提案内容テキスト</p>");
    expect(result.content).toContain("<li>根拠1</li>");
    expect(result.content).toContain("<li>根拠2</li>");
    expect(result.content).toContain("<li>根拠3</li>");
    expect(result.fallbackActivated).toBe(true);
    expect(result.errorMessage).toBeUndefined();
  });
});