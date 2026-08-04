import { generateRecommendationReport } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェントの推奨根拠の可視化機能", () => {
  test("SCEN-164: レポート生成・アップロード機能 - 推奨内容がPDF形式でアップロード成功時にダウンロードURLが返却される", async () => {
    // Setup: AIRecommendationEngineスタブ
    const aiRecommendationEngineStub = {
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendationId: "rec_20260801_001",
        customerName: "テスト株式会社",
        recommendedApproach: "提案アプローチA：経営効率化提案",
        rationale: [
          {
            factor: "顧客業種",
            value: "製造業",
            evidence: "過去の同業種成功事例で採用率85%",
          },
          {
            factor: "企業規模",
            value: "従業員数500名",
            evidence: "規模別成功パターン：従業員数400-600名での成約率72%",
          },
          {
            factor: "営業段階",
            value: "初回提案",
            evidence: "初回提案での採用実績：過去12ヶ月で68件中42件成約",
          },
        ],
        confidenceScore: 82,
        generatedAt: "2026-08-01T10:30:00Z",
      }),
    };

    // Setup: FileStorageAdapterスタブ
    const fileStorageAdapterStub = {
      uploadRecommendationReport: jest.fn().mockResolvedValue({
        uploadId: "upload_20260801_001",
        s3Key: "recommendations/rec_20260801_001/report.pdf",
        uploadedAt: "2026-08-01T10:31:00Z",
        status: 200,
      }),
      generateDownloadUrl: jest.fn().mockResolvedValue({
        downloadUrl:
          "https://s3.amazonaws.com/sales-ai-bucket/recommendations/rec_20260801_001/report.pdf?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=...",
        expiresAt: 1722510660,
        expirationSeconds: 3600,
        status: 200,
      }),
    };

    // Execute: generateRecommendationReport関数を呼び出し
    const input = {
      customerId: "cust_12345",
      customerName: "テスト株式会社",
      industry: "製造業",
      employeeCount: 500,
      dealStage: "初回提案",
      dealConditions: {
        productCategory: "システム提案",
        budgetRange: "5000万円～1億円",
        implementationTimeline: "3ヶ月",
      },
    };

    const result = await generateRecommendationReport(
      input,
      aiRecommendationEngineStub,
      fileStorageAdapterStub
    );

    // Verify: AIRecommendationEngineスタブのgenerateRecommendationが呼び出されたことを確認
    expect(aiRecommendationEngineStub.generateRecommendation).toHaveBeenCalledWith(
      expect.objectContaining({
        customerName: "テスト株式会社",
        industry: "製造業",
        employeeCount: 500,
        dealStage: "初回提案",
      })
    );

    // Verify: FileStorageAdapterスタブのuploadRecommendationReportが呼び出されたことを確認
    expect(fileStorageAdapterStub.uploadRecommendationReport).toHaveBeenCalled();
    const uploadCall = fileStorageAdapterStub.uploadRecommendationReport.mock
      .calls[0][0];
    expect(uploadCall).toMatchObject({
      reportContent: expect.any(String),
      recommendationId: "rec_20260801_001",
      customerName: "テスト株式会社",
      format: "pdf",
    });

    // Verify: PDF形式でのレポート内容が含まれていることを確認
    expect(uploadCall.reportContent).toContain("テスト株式会社");
    expect(uploadCall.reportContent).toContain("提案アプローチA");
    expect(uploadCall.reportContent).toContain("82");

    // Verify: FileStorageAdapterスタブのgenerateDow downloadUrlが呼び出されたことを確認
    expect(fileStorageAdapterStub.generateDownloadUrl).toHaveBeenCalledWith(
      expect.objectContaining({
        uploadId: "upload_20260801_001",
        s3Key: "recommendations/rec_20260801_001/report.pdf",
      })
    );

    // Verify: ダウンロードURL返却形式の検証
    expect(result).toMatchObject({
      downloadUrl:
        "https://s3.amazonaws.com/sales-ai-bucket/recommendations/rec_20260801_001/report.pdf?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=...",
      expiresAt: 1722510660,
      expirationSeconds: 3600,
      status: 200,
      reportMetadata: {
        recommendationId: "rec_20260801_001",
        customerName: "テスト株式会社",
        confidenceScore: 82,
        generatedAt: "2026-08-01T10:30:00Z",
        uploadedAt: "2026-08-01T10:31:00Z",
      },
    });

    // Verify: ダウンロードURL形式がhttps://s3.amazonaws.comで始まることを確認
    expect(result.downloadUrl).toMatch(/^https:\/\/s3\.amazonaws\.com\//);

    // Verify: 有効期限がUNIX時刻（秒単位）で、デフォルト3600秒後であることを確認
    expect(result.expirationSeconds).toBe(3600);
    expect(typeof result.expiresAt).toBe("number");
    expect(result.expiresAt).toBeGreaterThan(1722507060);

    // Verify: HTTPステータスコード200が返却されていることを確認
    expect(result.status).toBe(200);

    // Verify: 返却されたレスポンスにPDF生成・アップロードメタデータが含まれていることを確認
    expect(result.reportMetadata).toBeDefined();
    expect(result.reportMetadata.recommendationId).toBe("rec_20260801_001");
  });
});