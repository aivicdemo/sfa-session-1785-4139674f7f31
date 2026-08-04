import { generateRecommendationWithFallback } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェント推奨根拠の可視化 - S3アップロード失敗時のHTML表示", () => {
  // SCEN-108
  test("S3アップロード失敗時に推奨内容がHTML形式で画面表示される", async () => {
    const mockRecommendationContent = {
      recommendedApproach: "顧客の経営課題に対して段階的な導入を提案",
      confidenceScore: 85,
      reasoning: "過去の類似案件5件で85%の成功率を確認",
      basePatterns: [
        {
          patternId: "PAT-001",
          description: "中堅製造業向け段階導入パターン",
          successRate: 87,
        },
      ],
      salesGuidance: "初回商談で経営層への価値説明を重視し、ROI試算を提示してください",
    };

    const mockFileStorageAdapter = {
      uploadRecommendationReport: jest
        .fn()
        .mockRejectedValueOnce(new Error("403 Forbidden"))
        .mockRejectedValueOnce(new Error("Connection timeout"))
        .mockRejectedValueOnce(new Error("Service unavailable")),
      generateDownloadUrl: jest.fn(),
      deleteExpiredReports: jest.fn(),
    };

    const mockAIRecommendationEngine = {
      generateRecommendation: jest
        .fn()
        .mockResolvedValue(mockRecommendationContent),
      findSimilarPatterns: jest.fn().mockResolvedValue([]),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const customerCondition = {
      customerId: "CUST-20240115-001",
      customerName: "ABC製造株式会社",
      industry: "製造業",
      employeeCount: 250,
      annualRevenue: 5000000000,
      currentChallenge: "生産効率化",
      budget: 10000000,
      timeline: "Q2 2024",
    };

    const result = await generateRecommendationWithFallback(
      customerCondition,
      mockAIRecommendationEngine,
      mockFileStorageAdapter
    );

    expect(mockFileStorageAdapter.uploadRecommendationReport).toHaveBeenCalledTimes(
      3
    );

    expect(result.fallbackApplied).toBe(true);
    expect(result.displayFormat).toBe("html");
    expect(result.errorMessage).toBe(
      "レポート生成に失敗しました。画面上で推奨内容を確認するか、後ほど再度お試しください"
    );

    expect(result.htmlContent).toContain(
      mockRecommendationContent.recommendedApproach
    );
    expect(result.htmlContent).toContain(
      mockRecommendationContent.reasoning
    );
    expect(result.htmlContent).toContain(
      mockRecommendationContent.salesGuidance
    );
    expect(result.htmlContent).toContain(
      `信頼度スコア: ${mockRecommendationContent.confidenceScore}`
    );

    expect(result.htmlContent).toContain("<html");
    expect(result.htmlContent).toContain("</html>");
    expect(result.htmlContent).toContain("<meta charset");
    expect(result.htmlContent).toContain("推奨内容");
    expect(result.htmlContent).toContain("根拠");
    expect(result.htmlContent).toContain("営業担当者向けガイダンス");

    expect(result.isDownloadable).toBe(true);
    expect(result.contentType).toBe("text/html");

    const operationLog = result.operationLogs?.[0];
    expect(operationLog).toBeDefined();
    expect(operationLog?.action).toBe("recommendation_retrieval_fallback");
    expect(operationLog?.status).toBe("fallback_html_displayed");
    expect(operationLog?.retryCount).toBe(3);
  });
});