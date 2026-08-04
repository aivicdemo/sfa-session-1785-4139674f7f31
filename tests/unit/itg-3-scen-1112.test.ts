import { generateRecommendationReport } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェント推奨根拠の可視化機能", () => {
  // SCEN-1112
  test("推奨レポート生成時にS3アップロードが失敗した場合、HTML形式で画面表示に切り替わる", async () => {
    const mockFileStorageAdapter = {
      uploadRecommendationReport: jest.fn()
        .mockRejectedValueOnce(new Error("503 Service Unavailable"))
        .mockRejectedValueOnce(new Error("503 Service Unavailable"))
        .mockRejectedValueOnce(new Error("503 Service Unavailable")),
      generateDownloadUrl: jest.fn(),
      deleteExpiredReports: jest.fn(),
    };

    const recommendationInput = {
      recommendationId: "REC-20240115-001",
      customerId: "CUST-001",
      proposedApproach: "顧客の経営課題を解決するため、段階的な導入アプローチを提案します",
      reasoningBasis: [
        "過去3年間の類似案件で85%の成約率実績",
        "顧客業種（製造業）での成功パターンマッチ度：92%",
        "営業担当者の行動パターンが標準プロセスに合致（乖離度：5%）",
      ],
      explanationForSalesPerson: "本案件は顧客の経営目標と提案内容の適合度が高く、過去成功事例との類似度が92%です。推奨タイミングは顧客の購買シグナル検出から2週間以内です。",
      confidenceScore: 88,
      generatedAt: new Date("2024-01-15T11:00:00Z").toISOString(),
    };

    const result = await generateRecommendationReport(
      recommendationInput,
      mockFileStorageAdapter
    );

    expect(result).toEqual({
      status: "fallback_to_html",
      userMessage: "レポート生成に失敗しました。画面上で推奨内容を確認するか、後ほど再度お試しください",
      htmlContent: expect.stringContaining("顧客の経営課題を解決するため、段階的な導入アプローチを提案します"),
      retryAttempts: 2,
      isHtmlRenderable: true,
      isBrowserSaveable: true,
    });

    expect(result.htmlContent).toContain("過去3年間の類似案件で85%の成約率実績");
    expect(result.htmlContent).toContain("顧客業種（製造業）での成功パターンマッチ度：92%");
    expect(result.htmlContent).toContain("営業担当者の行動パターンが標準プロセスに合致（乖離度：5%）");
    expect(result.htmlContent).toContain("本案件は顧客の経営目標と提案内容の適合度が高く、過去成功事例との類似度が92%です。推奨タイミングは顧客の購買シグナル検出から2週間以内です。");

    expect(mockFileStorageAdapter.uploadRecommendationReport).toHaveBeenCalledTimes(3);
    expect(result.retryAttempts).toBe(2);
  });
});