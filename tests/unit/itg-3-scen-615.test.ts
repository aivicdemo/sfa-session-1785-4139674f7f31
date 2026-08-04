import { generateRecommendationReportWithFallback } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェントの推奨根拠の可視化機能", () => {
  // SCEN-615
  test("[normal] 推奨レポート生成・保存機能 - Amazon S3へのアップロード失敗時に推奨内容がHTML形式で画面表示される", async () => {
    const testCustomerName = "テスト太郎";
    const testProductName = "クラウドERP";
    const testBudget = "500万円";
    const recommendationContent = "段階的導入アプローチ";

    const mockAIEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendation: recommendationContent,
        confidence: 85,
      }),
    };

    let uploadAttemptCount = 0;
    const mockFileStorage = {
      uploadRecommendationReport: jest.fn().mockImplementation(() => {
        uploadAttemptCount++;
        return Promise.reject(new Error("S3 authentication failed"));
      }),
      generateDownloadUrl: jest.fn(),
      deleteExpiredReports: jest.fn(),
    };

    const newCaseInput = {
      customerName: testCustomerName,
      productName: testProductName,
      budget: testBudget,
      recommendationContent: recommendationContent,
    };

    const result = await generateRecommendationReportWithFallback(
      newCaseInput,
      mockAIEngine,
      mockFileStorage
    );

    expect(result.success).toBe(false);
    expect(result.fallbackHtmlContent).toBeDefined();
    expect(result.errorMessage).toMatch(/レポート生成に失敗しました/);

    expect(result.fallbackHtmlContent).toContain("<div");
    expect(result.fallbackHtmlContent).toContain(testCustomerName);
    expect(result.fallbackHtmlContent).toContain(testProductName);
    expect(result.fallbackHtmlContent).toContain(testBudget);
    expect(result.fallbackHtmlContent).toContain(recommendationContent);
    expect(result.fallbackHtmlContent).toContain("</div>");

    expect(uploadAttemptCount).toBe(3);

    expect(mockFileStorage.uploadRecommendationReport).toHaveBeenCalledTimes(3);
  });
});