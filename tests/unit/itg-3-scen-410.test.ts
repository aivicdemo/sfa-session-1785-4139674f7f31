import {
  generateInferenceValidationReport,
  uploadRecommendationReportToStorage,
  generateDownloadUrlForReport,
} from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェント推奨根拠の可視化機能 - 推論精度検証とレポート生成", () => {
  // SCEN-410
  test("推論精度検証機能 - Amazon S3が正常応答した場合、検証結果レポートをPDF/Excel形式でアップロード完了", async () => {
    const mockAIEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        approach: "営業訪問後フォローアップメール送信",
        confidenceScore: 87,
        reasoning: [
          "過去成功事例との顧客属性一致度: 92%",
          "購買シグナル検出: 複数回の資料閲覧",
          "フォローアップ成功パターン適合度: 85%",
        ],
      }),
      findSimilarPatterns: jest.fn().mockResolvedValue([
        {
          patternId: "P-001",
          matchScore: 92,
          caseDescription: "類似顧客A: 3営業日後成約",
        },
        {
          patternId: "P-002",
          matchScore: 87,
          caseDescription: "類似顧客B: 初回フォロー後成約",
        },
      ]),
    };

    const mockFileStorage = {
      uploadRecommendationReport: jest.fn().mockResolvedValue({
        statusCode: 200,
        fileKey: "reports/inference-validation-2024-01-15T11-00-00Z.pdf",
        eTag: '"abc123def456"',
        uploadedAt: "2024-01-15T11:00:00Z",
      }),
      generateDownloadUrl: jest.fn().mockResolvedValue({
        url: "https://s3.amazonaws.com/recommendation-reports/inference-validation-2024-01-15T11-00-00Z.pdf?X-Amz-Expires=86400",
        expiresAt: "2024-01-16T11:00:00Z",
        expirationSeconds: 86400,
      }),
    };

    const validationInput = {
      recommendationId: "REC-20240115-001",
      dealId: "DEAL-20240115-001",
      customerId: "CUST-0001",
      customerName: "ABC Corporation",
      industry: "manufacturing",
      dealStage: "proposal",
      proposalContent: "生産効率化ソリューション提案",
      recommendationTimestamp: "2024-01-15T10:00:00Z",
    };

    const reportData = await generateInferenceValidationReport(
      validationInput,
      mockAIEngine
    );

    expect(reportData).toBeDefined();
    expect(reportData.recommendationId).toBe("REC-20240115-001");
    expect(reportData.inferenceScore).toBe(87);
    expect(reportData.reasoningFactors).toEqual([
      "過去成功事例との顧客属性一致度: 92%",
      "購買シグナル検出: 複数回の資料閲覧",
      "フォローアップ成功パターン適合度: 85%",
    ]);
    expect(reportData.similarPatterns).toHaveLength(2);
    expect(reportData.similarPatterns[0].matchScore).toBe(92);
    expect(reportData.reportFormats).toEqual(["pdf", "xlsx"]);

    const pdfUploadResult = await uploadRecommendationReportToStorage(
      {
        reportId: reportData.reportId,
        format: "pdf",
        content: reportData.pdfContent,
        customerId: "CUST-0001",
        dealId: "DEAL-20240115-001",
      },
      mockFileStorage
    );

    expect(pdfUploadResult).toBeDefined();
    expect(pdfUploadResult.statusCode).toBe(200);
    expect(pdfUploadResult.fileKey).toBe(
      "reports/inference-validation-2024-01-15T11-00-00Z.pdf"
    );
    expect(pdfUploadResult.eTag).toBe('"abc123def456"');
    expect(pdfUploadResult.uploadedAt).toBe("2024-01-15T11:00:00Z");
    expect(pdfUploadResult.fileFormat).toBe("application/pdf");
    expect(pdfUploadResult.uploadStatus).toBe("uploaded");

    const xlsxUploadResult = await uploadRecommendationReportToStorage(
      {
        reportId: reportData.reportId,
        format: "xlsx",
        content: reportData.xlsxContent,
        customerId: "CUST-0001",
        dealId: "DEAL-20240115-001",
      },
      mockFileStorage
    );

    expect(xlsxUploadResult).toBeDefined();
    expect(xlsxUploadResult.statusCode).toBe(200);
    expect(xlsxUploadResult.fileFormat).toBe(
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    expect(xlsxUploadResult.uploadStatus).toBe("uploaded");

    const downloadUrlResult = await generateDownloadUrlForReport(
      {
        fileKey: pdfUploadResult.fileKey,
        expirationHours: 24,
      },
      mockFileStorage
    );

    expect(downloadUrlResult).toBeDefined();
    expect(downloadUrlResult.url).toContain(
      "https://s3.amazonaws.com/recommendation-reports/"
    );
    expect(downloadUrlResult.url).toContain("X-Amz-Expires=86400");
    expect(downloadUrlResult.expiresAt).toBe("2024-01-16T11:00:00Z");
    expect(downloadUrlResult.expirationSeconds).toBe(86400);

    const reportMetadata = {
      reportId: reportData.reportId,
      recommendationId: "REC-20240115-001",
      dealId: "DEAL-20240115-001",
      customerId: "CUST-0001",
      pdfFileKey: pdfUploadResult.fileKey,
      xlsxFileKey: xlsxUploadResult.fileKey,
      uploadedAtPdf: "2024-01-15T11:00:00Z",
      uploadedAtXlsx: xlsxUploadResult.uploadedAt,
      pdfFileFormat: "application/pdf",
      xlsxFileFormat:
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      uploadStatusPdf: "uploaded",
      uploadStatusXlsx: "uploaded",
      pdfDownloadUrl: downloadUrlResult.url,
      pdfDownloadUrlExpiresAt: "2024-01-16T11:00:00Z",
      inferenceScore: 87,
      reasoningCount: 3,
      similarPatternCount: 2,
      createdAt: "2024-01-15T11:00:00Z",
    };

    expect(reportMetadata.reportId).toBeDefined();
    expect(reportMetadata.pdfFileKey).toBe(
      "reports/inference-validation-2024-01-15T11-00-00Z.pdf"
    );
    expect(reportMetadata.xlsxFileKey).toBeDefined();
    expect(reportMetadata.uploadedAtPdf).toBe("2024-01-15T11:00:00Z");
    expect(reportMetadata.pdfFileFormat).toBe("application/pdf");
    expect(reportMetadata.xlsxFileFormat).toBe(
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    expect(reportMetadata.uploadStatusPdf).toBe("uploaded");
    expect(reportMetadata.uploadStatusXlsx).toBe("uploaded");
    expect(reportMetadata.pdfDownloadUrl).toContain("https://");
    expect(reportMetadata.pdfDownloadUrlExpiresAt).toBe(
      "2024-01-16T11:00:00Z"
    );
    expect(reportMetadata.inferenceScore).toBe(87);
    expect(reportMetadata.reasoningCount).toBe(3);
    expect(reportMetadata.similarPatternCount).toBe(2);

    expect(mockFileStorage.uploadRecommendationReport).toHaveBeenCalledTimes(2);
    expect(mockFileStorage.generateDownloadUrl).toHaveBeenCalledTimes(1);
  });
});