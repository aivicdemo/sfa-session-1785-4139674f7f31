import { generateRecommendationReport } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェントの推奨根拠の可視化機能", () => {
  // SCEN-782
  test("should display recommendation content as HTML on screen and make it downloadable via browser save when file storage upload fails after 2 retries", async () => {
    const mockRecommendationContent = {
      recommendationText: "提案内容: クラウドERPの導入により、在庫管理を自動化し、発注コストを30%削減できます。",
      reasoningExplanation: "理由: 過去3年の同業種案件では、在庫自動化により平均32%のコスト削減を実現。貴社の年間発注処理量（約5000件）から推定すると、同程度の効果が期待できます。",
      patternId: "pattern_cloud_erp_001",
      confidenceScore: 0.87,
      similarCases: [
        {
          caseId: "case_2023_0451",
          industryType: "製造業",
          companySize: "従業員300名規模",
          outcome: "成約",
        },
        {
          caseId: "case_2023_0512",
          industryType: "流通業",
          companySize: "従業員250名規模",
          outcome: "成約",
        },
      ],
      riskFactors: [
        {
          riskName: "導入期間の営業停止リスク",
          mitigationStrategy: "段階的な移行計画で対応可能",
        },
      ],
    };

    const mockFileStorageAdapter = {
      uploadRecommendationReport: jest
        .fn()
        .mockRejectedValueOnce(new Error("S3アップロード失敗: NetworkError"))
        .mockRejectedValueOnce(new Error("S3アップロード失敗: NetworkError"))
        .mockRejectedValueOnce(new Error("S3アップロード失敗: NetworkError")),
      generateDownloadUrl: jest.fn(),
      deleteExpiredReports: jest.fn(),
    };

    const mockAIRecommendationEngine = {
      generateRecommendation: jest
        .fn()
        .mockResolvedValueOnce(mockRecommendationContent),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const customerInput = {
      customerId: "cust_20240115_001",
      customerName: "株式会社ABC商事",
      industry: "流通業",
      companySize: 280,
      primaryChallenge: "在庫管理業務の自動化",
      annualOrderVolume: 4800,
      currentSystemAge: 8,
    };

    const dealInput = {
      dealId: "deal_20240115_0001",
      dealStage: "提案準備",
      estimatedDealValue: 2500000,
      proposedProductCategory: "クラウドERP",
    };

    const result = await generateRecommendationReport(
      customerInput,
      dealInput,
      mockAIRecommendationEngine,
      mockFileStorageAdapter
    );

    expect(mockAIRecommendationEngine.generateRecommendation).toHaveBeenCalledWith(
      customerInput,
      dealInput
    );

    expect(mockFileStorageAdapter.uploadRecommendationReport).toHaveBeenCalledTimes(3);

    const firstCall = mockFileStorageAdapter.uploadRecommendationReport.mock
      .calls[0];
    expect(firstCall[0]).toEqual(
      expect.objectContaining({
        recommendationText: expect.stringContaining("クラウドERP"),
        patternId: "pattern_cloud_erp_001",
      })
    );

    expect(result.htmlContent).toContain("<html");
    expect(result.htmlContent).toContain(
      "提案内容: クラウドERPの導入により、在庫管理を自動化し、発注コストを30%削減できます。"
    );
    expect(result.htmlContent).toContain(
      "理由: 過去3年の同業種案件では、在庫自動化により平均32%のコスト削減を実現。"
    );
    expect(result.htmlContent).toContain("pattern_cloud_erp_001");
    expect(result.htmlContent).toContain("case_2023_0451");
    expect(result.htmlContent).toContain("case_2023_0512");
    expect(result.htmlContent).toContain("導入期間の営業停止リスク");
    expect(result.htmlContent).toContain("段階的な移行計画で対応可能");

    expect(result.userMessage).toBe(
      "レポート生成に失敗しました。画面上で推奨内容を確認するか、後ほど再度お試しください"
    );

    expect(result.displayMode).toBe("HTML");
    expect(result.isDownloadable).toBe(true);
    expect(result.fallbackApplied).toBe(true);
    expect(result.retryAttempts).toBe(2);
  });
});