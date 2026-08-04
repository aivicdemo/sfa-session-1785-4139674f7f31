import { describe, test, expect, beforeEach, afterEach } from "@jest/globals";
import { generateRecommendationWithReportHandling } from "../../src/logic/it-1-br-3-1-1-1";

const fetchMock = require("jest-fetch-mock");

describe("AIエージェント推奨支援システム - レポート生成失敗時の代替表示", () => {
  beforeEach(() => {
    fetchMock.enableMocks();
    fetchMock.resetMocks();
  });

  afterEach(() => {
    fetchMock.disableMocks();
  });

  // SCEN-2743
  test("generateRecommendationWithReportHandling: ダウンロードURL生成失敗時にエラーメッセージと代替HTML表示を同時に返す", async () => {
    const mockAIEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendationId: "rec-20240115-001",
        proposalApproach: "顧客の経営課題解決型の提案を推奨",
        confidenceScore: 85,
        reasoning:
          "過去の類似案件（業種：製造、規模：従業員500-1000名）において、このアプローチで70%の成約率を実現",
        successPatternReference: "pattern-2023-0847",
      }),
      findSimilarPatterns: jest.fn().mockResolvedValue([]),
      explainRecommendationReasoning: jest.fn().mockResolvedValue(""),
      evaluatePatternRelevance: jest.fn().mockResolvedValue(0),
    };

    const mockFileStorage = {
      uploadRecommendationReport: jest
        .fn()
        .mockResolvedValue("s3://bucket/reports/rec-20240115-001.pdf"),
      generateDownloadUrl: jest
        .fn()
        .mockRejectedValue(new Error("S3 timeout")),
      deleteExpiredReports: jest.fn().mockResolvedValue(undefined),
    };

    const customerInput = {
      customerId: "cust-2024-0115",
      customerName: "株式会社サンプル",
      industry: "製造業",
      scale: 750,
      contactEmail: "sales@example.com",
      dealConditions: {
        productCategory: "システム導入",
        estimatedBudget: 5000000,
        timeline: "Q2 2024",
      },
    };

    const result = await generateRecommendationWithReportHandling(
      customerInput,
      mockAIEngine,
      mockFileStorage
    );

    expect(result).toEqual({
      statusCode: 200,
      recommendation: {
        recommendationId: "rec-20240115-001",
        proposalApproach: "顧客の経営課題解決型の提案を推奨",
        confidenceScore: 85,
        reasoning:
          "過去の類似案件（業種：製造、規模：従業員500-1000名）において、このアプローチで70%の成約率を実現",
        successPatternReference: "pattern-2023-0847",
      },
      errorMessage:
        "レポート生成に失敗しました。画面上で推奨内容を確認するか、後ほど再度お試しください",
      fallbackHtmlContent: expect.stringContaining("recommendationId"),
      downloadUrl: null,
      displayBehavior: "show_error_and_html",
    });

    expect(result.fallbackHtmlContent).toContain("rec-20240115-001");
    expect(result.fallbackHtmlContent).toContain(
      "顧客の経営課題解決型の提案を推奨"
    );
    expect(result.fallbackHtmlContent).toContain("85");
    expect(result.errorMessage).toBe(
      "レポート生成に失敗しました。画面上で推奨内容を確認するか、後ほど再度お試しください"
    );
    expect(result.displayBehavior).toBe("show_error_and_html");
    expect(mockFileStorage.generateDownloadUrl).toHaveBeenCalled();
  });
});