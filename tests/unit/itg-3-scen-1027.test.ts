import { generateRecommendationReportWithUrl } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェントの推奨根拠の可視化機能", () => {
  // SCEN-1027
  test("ファイル生成・保存時のリトライ処理 - Amazon S3アップロードが正常に完了した場合、有効期限付きダウンロードURLが生成される", async () => {
    const mockFileStorageAdapter = {
      uploadRecommendationReport: jest.fn().mockResolvedValue({
        s3ObjectKey: "reports/recommendation_20260801_abc123.pdf",
      }),
      generateDownloadUrl: jest.fn().mockResolvedValue({
        url: "https://s3.amazonaws.com/bucket-name/reports/recommendation_20260801_abc123.pdf?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAIOSFODNN7EXAMPLE%2F20260801%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20260801T120000Z&X-Amz-Expires=3600&X-Amz-Signature=SomeSignatureValue&X-Amz-SignedHeaders=host",
        expiresInSeconds: 3600,
      }),
    };

    const recommendationData = {
      dealId: "deal_12345",
      customerId: "cust_67890",
      recommendationContent: {
        approachType: "direct_proposal",
        proposedTiming: "immediate",
        confidenceScore: 87,
      },
      reasoningBasis: {
        pastSuccessPatterns: [
          {
            patternId: "pattern_001",
            matchDegree: 0.92,
            similarCustomerCount: 5,
          },
        ],
        dealConditions: {
          industry: "manufacturing",
          companySize: "large",
          purchaseAmount: 5000000,
        },
        successFactors: [
          "direct_engagement_with_cfo",
          "competitive_threat_mentioned",
        ],
      },
      generatedAt: "2026-08-01T12:00:00Z",
    };

    const result = await generateRecommendationReportWithUrl(
      recommendationData,
      mockFileStorageAdapter
    );

    expect(mockFileStorageAdapter.uploadRecommendationReport).toHaveBeenCalledWith(
      expect.objectContaining({
        dealId: "deal_12345",
        customerId: "cust_67890",
      })
    );

    expect(mockFileStorageAdapter.generateDownloadUrl).toHaveBeenCalledWith(
      "reports/recommendation_20260801_abc123.pdf"
    );

    expect(result.downloadUrl).toMatch(/^https:\/\/s3\.amazonaws\.com\//);
    expect(result.downloadUrl).toMatch(/X-Amz-Algorithm=AWS4-HMAC-SHA256/);
    expect(result.downloadUrl).toMatch(/X-Amz-Expires=3600/);
    expect(result.downloadUrl).toMatch(/X-Amz-Signature=/);
    expect(result.downloadUrl).toMatch(/X-Amz-SignedHeaders=host/);
    expect(result.downloadUrl).toMatch(/X-Amz-Date=20260801T120000Z/);
    expect(result.expiresInSeconds).toBe(3600);
    expect(result.s3ObjectKey).toBe("reports/recommendation_20260801_abc123.pdf");
  });
});