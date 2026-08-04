import { describe, test, expect, beforeEach, jest } from "@jest/globals";

describe("AIエージェント推奨根拠の可視化機能 - レポート生成・アップロード", () => {
  // SCEN-307
  test("推奨内容が1件のとき、その推奨内容を含むレポートが生成される", async () => {
    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        proposalApproach: "顧客の経営課題に基づいた段階的な導入アプローチ",
        reasoning: [
          "顧客業種：製造業",
          "現在の課題：デジタル化推進",
          "成功事例との合致度：高",
        ],
        relevanceScore: 87,
      }),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const mockFileStorageAdapter = {
      uploadRecommendationReport: jest.fn().mockResolvedValue({
        downloadUrl:
          "https://example-bucket.s3.amazonaws.com/reports/rec_20240115_abc123?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=...",
        expiresIn: 3600,
      }),
      generateDownloadUrl: jest.fn(),
      deleteExpiredReports: jest.fn(),
    };

    const { generateAndUploadRecommendationReport } = await import(
      "../../src/logic/it-1-br-3-1-1-1"
    );

    const inputRecommendations = [
      {
        customerId: "CUST_001",
        dealId: "DEAL_20240115_001",
        proposalApproach: "顧客の経営課題に基づいた段階的な導入アプローチ",
        reasoning: [
          "顧客業種：製造業",
          "現在の課題：デジタル化推進",
          "成功事例との合致度：高",
        ],
        relevanceScore: 87,
        generatedAt: new Date("2024-01-15T10:30:00Z"),
      },
    ];

    const result = await generateAndUploadRecommendationReport(
      inputRecommendations,
      mockAIRecommendationEngine,
      mockFileStorageAdapter
    );

    expect(mockFileStorageAdapter.uploadRecommendationReport).toHaveBeenCalledTimes(
      1
    );

    expect(result).toEqual({
      reportFormat: "PDF",
      downloadUrl:
        "https://example-bucket.s3.amazonaws.com/reports/rec_20240115_abc123?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=...",
      expiresIn: 3600,
      generatedAt: new Date("2024-01-15T10:30:00Z"),
    });

    const uploadCall = mockFileStorageAdapter.uploadRecommendationReport.mock
      .calls[0];
    expect(uploadCall).toBeDefined();
    const uploadedReport = uploadCall[0];

    expect(uploadedReport).toHaveProperty("proposalApproaches");
    expect(uploadedReport.proposalApproaches).toContain(
      "顧客の経営課題に基づいた段階的な導入アプローチ"
    );

    expect(uploadedReport).toHaveProperty("reasoning");
    expect(uploadedReport.reasoning).toContain(
      "顧客業種：製造業"
    );
    expect(uploadedReport.reasoning).toContain("現在の課題：デジタル化推進");
    expect(uploadedReport.reasoning).toContain("成功事例との合致度：高");

    expect(uploadedReport).toHaveProperty("relevanceScores");
    expect(uploadedReport.relevanceScores).toContain(87);

    expect(result.reportFormat).toBe("PDF");

    const urlPattern = /^https:\/\/.*\.s3\.amazonaws\.com\/.*\?.*X-Amz-Algorithm=AWS4-HMAC-SHA256.*/;
    expect(result.downloadUrl).toMatch(urlPattern);
  });
});