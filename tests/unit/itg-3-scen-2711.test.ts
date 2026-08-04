import { describe, test, expect, beforeEach, afterEach } from "@jest/globals";
import { generateRecommendationReportWithExpiredUrl } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェント推奨根拠の可視化機能", () => {
  // SCEN-2711
  test("推奨レポート生成・保存機能 - 有効期限切れURLの場合、ダウンロード不可でフォールバック表示", async () => {
    const currentTime = new Date("2024-01-15T12:00:00Z");
    const expiredTime = new Date("2024-01-15T11:00:00Z");

    const mockFileStorageAdapter = {
      uploadRecommendationReport: jest.fn().mockResolvedValue({
        success: true,
        fileKey: "report_key_12345",
      }),
      generateDownloadUrl: jest.fn().mockResolvedValue({
        url: "https://s3.example.com/reports/report_12345.pdf?X-Amz-Expires=3600&X-Amz-Date=20240115T110000Z",
        expiresAt: expiredTime.toISOString(),
      }),
      deleteExpiredReports: jest.fn().mockResolvedValue({
        success: true,
        deletedCount: 1,
      }),
    };

    const recommendationData = {
      customerId: "cust_001",
      dealId: "deal_5678",
      recommendedApproach: "顧客ニーズに基づいた段階的提案",
      confidenceScore: 87,
      reasoning: [
        {
          factor: "過去成功事例との類似度",
          value: 0.92,
        },
        {
          factor: "顧客業種別成功率",
          value: 0.88,
        },
      ],
      timestamp: currentTime.toISOString(),
    };

    const result = await generateRecommendationReportWithExpiredUrl(
      recommendationData,
      mockFileStorageAdapter,
      currentTime
    );

    expect(result.success).toBe(false);
    expect(result.errorCode).toBe(403);
    expect(result.errorMessage).toMatch(/有効期限/);
    expect(result.fallbackAction.type).toBe("html_display");
    expect(result.fallbackAction.message).toMatch(/レポート生成に失敗しました/);
    expect(result.fallbackAction.content).toStrictEqual({
      format: "html",
      recommendationContent: {
        approach: "顧客ニーズに基づいた段階的提案",
        score: 87,
        factors: [
          {
            name: "過去成功事例との類似度",
            value: 0.92,
          },
          {
            name: "顧客業種別成功率",
            value: 0.88,
          },
        ],
      },
    });
    expect(
      result.fallbackAction.message.includes("画面上で推奨内容を確認するか")
    ).toBe(true);
    expect(
      result.fallbackAction.message.includes("後ほど再度お試しください")
    ).toBe(true);
    expect(mockFileStorageAdapter.generateDownloadUrl).toHaveBeenCalledWith(
      "report_key_12345"
    );
  });
});