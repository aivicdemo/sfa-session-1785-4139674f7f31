import { generateRecommendationReportWithFallback } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェント推奨根拠の可視化機能", () => {
  // SCEN-2706
  test("FileStorageAdapter.uploadRecommendationReportが失敗したとき、推奨内容がHTML形式で画面表示される", async () => {
    const customerName = "A社";
    const proposalApproach = "クラウド移行支援";
    const successRate = 85;
    const recommendationReasoning = "過去の類似案件から、貴社の業種・規模に適合した提案パターンを抽出しました。";

    const mockRecommendation = {
      customerName: customerName,
      proposalApproach: proposalApproach,
      successRate: successRate,
      reasoning: recommendationReasoning,
      timestamp: new Date("2026-08-01T10:00:00Z"),
    };

    const mockAIEngine = {
      generateRecommendation: jest.fn().mockResolvedValue(mockRecommendation),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const s3ConnectionError = new Error("S3接続エラー");

    const mockFileStorageAdapter = {
      uploadRecommendationReport: jest
        .fn()
        .mockRejectedValue(s3ConnectionError),
      generateDownloadUrl: jest.fn(),
      deleteExpiredReports: jest.fn(),
    };

    const result = await generateRecommendationReportWithFallback(
      mockAIEngine,
      mockFileStorageAdapter,
      {
        customerId: "CUST001",
        dealId: "DEAL001",
      }
    );

    expect(result.displayMethod).toBe("html");
    expect(result.htmlContent).toContain(customerName);
    expect(result.htmlContent).toContain(proposalApproach);
    expect(result.htmlContent).toContain(`${successRate}%`);
    expect(result.htmlContent).toContain(recommendationReasoning);
    expect(result.htmlContent).toContain(
      "ブラウザの保存機能を使用してダウンロードできます"
    );
    expect(result.errorMessage).toBe(
      "レポート生成に失敗しました。画面上で推奨内容を確認するか、後ほど再度お試しください"
    );
    expect(result.retryAttempts).toBe(2);
    expect(mockFileStorageAdapter.uploadRecommendationReport).toHaveBeenCalledTimes(
      2
    );
  });
});