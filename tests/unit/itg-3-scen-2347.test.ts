import { generateRecommendationReport } from "../../src/logic/it-1-br-3-2-1-1";

describe("AIエージェント推奨内容の根拠表示機能", () => {
  test("SCEN-2347: 推奨レポート生成からS3アップロード、ダウンロードURL生成までの一連処理が正常に完了する", () => {
    // Arrange: FileStorageAdapterのモック化
    const mockUploadRecommendationReport = jest.fn().mockResolvedValue({
      bucketName: "ai-recommendations",
      objectKey: "report_2347_20250801.pdf",
      eTag: "abc123def456",
    });

    const mockGenerateDownloadUrl = jest.fn().mockResolvedValue(
      "https://ai-recommendations.s3.amazonaws.com/report_2347_20250801.pdf?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Expires=3600&X-Amz-Credential=AKIAIOSFODNN7EXAMPLE%2F20250801%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-SignedHeaders=host&X-Amz-Signature=sample_signature_value"
    );

    const mockFileStorageAdapter = {
      uploadRecommendationReport: mockUploadRecommendationReport,
      generateDownloadUrl: mockGenerateDownloadUrl,
    };

    // 推奨レポートオブジェクトの作成
    const recommendationReport = {
      recommendationId: "rec_2347",
      recommendationContent: "顧客の購買タイミングは3ヶ月後が最適",
      reasoningBasis: [
        {
          factorType: "購買サイクル",
          factorValue: "3ヶ月",
          evidenceData: "過去の同業種顧客の平均購買間隔",
          confidenceScore: 0.92,
        },
        {
          factorType: "季節性",
          factorValue: "Q3",
          evidenceData: "営業担当者の提案成功パターンマッチ",
          confidenceScore: 0.87,
        },
      ],
      salesPersonInfo: {
        salesPersonId: "sp_001",
        salesPersonName: "山田太郎",
        department: "営業部",
      },
      generatedAt: "2025-08-01T10:30:00Z",
      reportFormat: "pdf",
    };

    // Act: 推奨レポート生成処理を実行
    const result = generateRecommendationReport(
      recommendationReport,
      mockFileStorageAdapter
    );

    // Assert: uploadRecommendationReportの呼び出しを確認
    expect(mockUploadRecommendationReport).toHaveBeenCalledTimes(1);
    expect(mockUploadRecommendationReport).toHaveBeenCalledWith(
      recommendationReport
    );

    // generateDownloadUrlの呼び出しを確認
    expect(mockGenerateDownloadUrl).toHaveBeenCalledTimes(1);
    expect(mockGenerateDownloadUrl).toHaveBeenCalledWith({
      bucketName: "ai-recommendations",
      objectKey: "report_2347_20250801.pdf",
      expirationSeconds: 3600,
    });

    // Assert: 生成されたダウンロードURLが期待通りであることを検証
    expect(result).toEqual({
      uploadStatus: "success",
      uploadedFile: {
        bucketName: "ai-recommendations",
        objectKey: "report_2347_20250801.pdf",
        eTag: "abc123def456",
      },
      downloadUrl:
        "https://ai-recommendations.s3.amazonaws.com/report_2347_20250801.pdf?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Expires=3600&X-Amz-Credential=AKIAIOSFODNN7EXAMPLE%2F20250801%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-SignedHeaders=host&X-Amz-Signature=sample_signature_value",
      expirationSeconds: 3600,
    });

    // ダウンロードURLがHTTPSスキームで開始することを確認
    expect(result.downloadUrl).toMatch(/^https:\/\//);

    // ダウンロードURLが署名付きパラメータを含むことを確認
    expect(result.downloadUrl).toMatch(/X-Amz-Algorithm=/);
    expect(result.downloadUrl).toMatch(/X-Amz-Expires=3600/);
    expect(result.downloadUrl).toMatch(/X-Amz-Signature=/);

    // 有効期限が3600秒であることを検証
    expect(result.expirationSeconds).toBe(3600);

    // アップロードステータスがsuccessであることを確認
    expect(result.uploadStatus).toBe("success");
  });
});