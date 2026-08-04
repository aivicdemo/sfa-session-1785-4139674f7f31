import { generateRecommendationReportAndSave } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェントの推奨根拠の可視化機能", () => {
  // SCEN-1067
  test("[normal] 推奨レポートの生成と保存 - Amazon S3（uploadRecommendationReport）が正常応答した場合、推奨内容がPDF形式で保存される", async () => {
    // モック化されたAIRecommendationEngine
    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        proposalApproach: "顧客の経営課題に基づいた段階的導入アプローチ",
        confidenceScore: 87,
        rootCauseAnalysis: "過去の類似案件で成功率85%以上のパターンと一致",
        successPatternId: "PATTERN-2024-001",
        generatedAt: "2024-01-15T11:00:00Z",
        pastSimilarCases: [
          {
            caseId: "CASE-2023-045",
            matchDegree: 92,
            outcome: "成約"
          },
          {
            caseId: "CASE-2023-032",
            matchDegree: 88,
            outcome: "成約"
          }
        ]
      }),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn()
    };

    // モック化されたFileStorageAdapter
    const mockFileStorageAdapter = {
      uploadRecommendationReport: jest.fn().mockResolvedValue({
        s3ObjectKey: "recommendations/2024-01-15/rec-cust-12345-20240115-110000.pdf",
        bucketName: "sales-ai-reports",
        uploadedAt: "2024-01-15T11:00:30Z",
        fileSize: 245876,
        contentType: "application/pdf"
      }),
      generateDownloadUrl: jest.fn(),
      deleteExpiredReports: jest.fn()
    };

    // 新規案件データ（顧客情報、商談条件、過去成功パターン参照ID等）
    const newDealInput = {
      customerId: "CUST-12345",
      customerName: "株式会社テスト",
      industry: "金融",
      companySize: "large",
      dealAmount: 5000000,
      dealStage: "proposal_preparation",
      pastSuccessPatternRef: "PATTERN-2024-001",
      currentDate: new Date("2024-01-15T11:00:00Z")
    };

    // 推奨レポート生成・保存フローを実行
    const result = await generateRecommendationReportAndSave(
      newDealInput,
      mockAIRecommendationEngine,
      mockFileStorageAdapter
    );

    // FileStorageAdapter.uploadRecommendationReport()が呼び出されたことを確認
    expect(mockFileStorageAdapter.uploadRecommendationReport).toHaveBeenCalled();

    // uploadRecommendationReport()に渡されたファイルオブジェクトを検査
    const uploadCall = mockFileStorageAdapter.uploadRecommendationReport.mock.calls[0];
    const fileObject = uploadCall[0];

    // Content-Typeが'application/pdf'であることを確認
    expect(fileObject.contentType).toBe("application/pdf");

    // PDF形式のヘッダ（%PDF-1.x）が存在することを確認
    const pdfBuffer = fileObject.buffer;
    expect(pdfBuffer).toBeInstanceOf(Buffer);
    const pdfHeader = pdfBuffer.toString("utf-8", 0, 4);
    expect(pdfHeader).toMatch(/%PDF/);

    // ファイルオブジェクトに推奨内容が埋め込まれていることを確認
    const pdfContent = pdfBuffer.toString("utf-8");
    expect(pdfContent).toContain("顧客の経営課題に基づいた段階的導入アプローチ");
    expect(pdfContent).toContain("87");
    expect(pdfContent).toContain("過去の類似案件で成功率85%以上のパターンと一致");
    expect(pdfContent).toContain("2024-01-15T11:00:00Z");

    // FileStorageAdapter.uploadRecommendationReport()の戻り値を確認
    expect(result.s3ObjectKey).toBe(
      "recommendations/2024-01-15/rec-cust-12345-20240115-110000.pdf"
    );
    expect(result.bucketName).toBe("sales-ai-reports");
    expect(result.uploadedAt).toBe("2024-01-15T11:00:30Z");

    // レポートメタデータが内部テーブル「レポートファイルメタデータ」に記録されていることを確認
    expect(result.metadata).toEqual({
      fileName: "rec-cust-12345-20240115-110000.pdf",
      format: "application/pdf",
      size: 245876,
      uploadedAt: "2024-01-15T11:00:30Z",
      s3Path: "recommendations/2024-01-15/rec-cust-12345-20240115-110000.pdf",
      customerId: "CUST-12345",
      dealAmount: 5000000,
      recommendationScore: 87,
      generatedAt: "2024-01-15T11:00:00Z"
    });

    // 全体的な結果検証
    expect(result).toEqual({
      success: true,
      s3ObjectKey: "recommendations/2024-01-15/rec-cust-12345-20240115-110000.pdf",
      bucketName: "sales-ai-reports",
      uploadedAt: "2024-01-15T11:00:30Z",
      metadata: {
        fileName: "rec-cust-12345-20240115-110000.pdf",
        format: "application/pdf",
        size: 245876,
        uploadedAt: "2024-01-15T11:00:30Z",
        s3Path: "recommendations/2024-01-15/rec-cust-12345-20240115-110000.pdf",
        customerId: "CUST-12345",
        dealAmount: 5000000,
        recommendationScore: 87,
        generatedAt: "2024-01-15T11:00:00Z"
      }
    });
  });
});