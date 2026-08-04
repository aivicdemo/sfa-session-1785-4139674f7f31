import {
  generateRecommendationReport,
} from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェントの推奨根拠の可視化機能", () => {
  // SCEN-2643
  test("推奨レポート生成・保存機能 - FileStorageAdapterへのアップロードが失敗したとき、代替動作でHTML形式が画面表示される", () => {
    const recommendationContent = {
      dealId: "DEAL-20240115-001",
      customerId: "CUST-ABC123",
      customerName: "顧客A株式会社",
      industry: "製造業",
      recommendedApproach: "提案アプローチ1",
      confidenceScore: 85,
      reasoning: [
        "過去の成功事例2件と類似パターン（顧客規模、業種、課題）を検出",
        "顧客の購買周期が3ヶ月単位であり、現在がフォローアップの最適期間内",
        "提案内容が顧客の経営課題と高度に適合（適合度88%）",
      ],
      successPatternReference: [
        {
          caseId: "CASE-2023-045",
          similarity: 0.92,
          description: "同業種、同規模顧客への成功事例",
        },
        {
          caseId: "CASE-2023-089",
          similarity: 0.78,
          description: "購買タイミングが類似した成功事例",
        },
      ],
      operationHistory: [
        {
          timestamp: "2024-01-15T10:30:00Z",
          action: "顧客情報入力",
          user: "sales_user_001",
        },
        {
          timestamp: "2024-01-15T10:35:00Z",
          action: "推奨内容生成",
          user: "system",
        },
      ],
    };

    const fileStorageAdapterStub = {
      uploadRecommendationReport: jest
        .fn()
        .mockRejectedValueOnce(new Error("Network timeout")),
      generateDownloadUrl: jest.fn(),
      deleteExpiredReports: jest.fn(),
    };

    const result = generateRecommendationReport(
      recommendationContent,
      fileStorageAdapterStub
    );

    expect(result.success).toBe(false);
    expect(result.fallbackMode).toBe(true);
    expect(result.errorMessage).toBe(
      "レポート生成に失敗しました。画面上で推奨内容を確認するか、後ほど再度お試しください"
    );

    expect(result.htmlContent).toBeDefined();
    expect(typeof result.htmlContent).toBe("string");

    expect(result.htmlContent).toContain(recommendationContent.dealId);
    expect(result.htmlContent).toContain(recommendationContent.customerName);
    expect(result.htmlContent).toContain(recommendationContent.industry);
    expect(result.htmlContent).toContain(
      recommendationContent.recommendedApproach
    );
    expect(result.htmlContent).toContain("85");

    expect(result.htmlContent).toContain("過去の成功事例2件と類似パターン");
    expect(result.htmlContent).toContain("顧客の購買周期が3ヶ月単位");
    expect(result.htmlContent).toContain("提案内容が顧客の経営課題");

    expect(result.htmlContent).toContain("CASE-2023-045");
    expect(result.htmlContent).toContain("0.92");
    expect(result.htmlContent).toContain("同業種、同規模顧客への成功事例");

    expect(result.htmlContent).toContain("CASE-2023-089");
    expect(result.htmlContent).toContain("0.78");

    expect(result.htmlContent).toContain("2024-01-15T10:30:00Z");
    expect(result.htmlContent).toContain("顧客情報入力");
    expect(result.htmlContent).toContain("sales_user_001");

    expect(result.htmlContent).toContain("2024-01-15T10:35:00Z");
    expect(result.htmlContent).toContain("推奨内容生成");

    expect(result.htmlContent).toMatch(
      /<!DOCTYPE html>|<html>|<body>|<div|<p/i
    );

    expect(fileStorageAdapterStub.uploadRecommendationReport).toHaveBeenCalledWith(
      expect.objectContaining({
        dealId: "DEAL-20240115-001",
        customerId: "CUST-ABC123",
      })
    );

    expect(result.downloadable).toBe(true);
  });
});