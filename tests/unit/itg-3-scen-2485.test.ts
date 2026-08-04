import { generateRecommendationReportAndUpload } from "../../src/logic/it-1-br-3-2-1-1";

describe("AIエージェント推奨内容の根拠表示機能", () => {
  // SCEN-2485
  test("推奨内容をExcel形式で生成しAmazon S3にアップロードする", async () => {
    const mockAIEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        customerId: "CUST-001",
        customerName: "株式会社テスト",
        dealCondition: {
          industry: "製造業",
          scale: "大企業",
          budget: 5000000,
          timeline: "2024-03-31",
        },
        recommendedApproach: "段階的導入アプローチ",
        reasoningExplanation:
          "過去の類似案件から、段階的導入により導入リスクを低減し、成功確度が80%に達する事例が多い",
        confidenceScore: 85,
      }),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const mockFileStorage = {
      uploadRecommendationReport: jest
        .fn()
        .mockResolvedValue({
          s3Path: "s3://reports-bucket/CUST-001/recommendation-2024-01-15.xlsx",
          fileName: "recommendation-2024-01-15.xlsx",
          uploadedAt: "2024-01-15T11:00:00Z",
        }),
      generateDownloadUrl: jest.fn(),
      deleteExpiredReports: jest.fn(),
    };

    const result = await generateRecommendationReportAndUpload(
      {
        customerId: "CUST-001",
        dealConditionInput: {
          industry: "製造業",
          scale: "大企業",
          budget: 5000000,
          timeline: "2024-03-31",
        },
      },
      mockAIEngine,
      mockFileStorage
    );

    expect(result.success).toBe(true);
    expect(result.message).toBe("レポートがアップロードされました");
    expect(result.fileFormat).toBe("xlsx");

    expect(mockAIEngine.generateRecommendation).toHaveBeenCalledWith({
      customerId: "CUST-001",
      dealCondition: {
        industry: "製造業",
        scale: "大企業",
        budget: 5000000,
        timeline: "2024-03-31",
      },
    });

    expect(mockFileStorage.uploadRecommendationReport).toHaveBeenCalled();
    const uploadCallArgs = mockFileStorage.uploadRecommendationReport
      .mock.calls[0][0];
    expect(uploadCallArgs.fileFormat).toBe("xlsx");
    expect(uploadCallArgs.fileName).toMatch(/\.xlsx$/);

    expect(result.metadata).toEqual({
      fileName: "recommendation-2024-01-15.xlsx",
      uploadedAt: "2024-01-15T11:00:00Z",
      s3Path: "s3://reports-bucket/CUST-001/recommendation-2024-01-15.xlsx",
    });
  });
});