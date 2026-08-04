import { generateRecommendationWithReportUpload } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェント推奨根拠可視化 - Amazon S3連携エラーハンドリング", () => {
  // SCEN-2924
  test("uploadRecommendationReportが想定外の応答形式を返した場合、誤ったファイル情報が業務結果として通されず、HTML画面表示フォールバックが動作する", () => {
    // =============== 準備 ===============
    const mockFileStorageAdapter = {
      uploadRecommendationReport: jest.fn().mockResolvedValue({
        // 想定外の応答形式: fileUrlが欠落
        // uploadTimestampが文字列ではなく数値
        // bucketNameがnull
        uploadTimestamp: 1705321200000,
        bucketName: null,
        // fileUrl は省略（必須フィールド欠落）
      }),
    };

    const mockAIEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendedApproach: "顧客業種：小売業、規模：中堅企業向けの提案",
        confidenceScore: 82,
        basedPatterns: ["パターンA", "パターンB"],
      }),
    };

    const recommendationRequest = {
      customerId: "CUST-20240115-001",
      customerIndustry: "retail",
      customerSize: "mid_market",
      dealAmount: 5000000,
      dealStage: "negotiation",
    };

    // =============== 実行 ===============
    const result = generateRecommendationWithReportUpload(
      recommendationRequest,
      mockFileStorageAdapter,
      mockAIEngine
    );

    // =============== 検証 ===============
    // 1. uploadRecommendationReportが呼ばれたことを確認
    expect(mockFileStorageAdapter.uploadRecommendationReport).toHaveBeenCalled();

    // 2. 誤ったファイル情報が業務結果として確定されていないことを確認
    expect(result.reportFileMetadata).toBeUndefined();
    expect(result.reportFileUrl).toBeUndefined();
    expect(result.reportUploadTimestamp).toBeUndefined();

    // 3. エラー状態が検出されていることを確認
    expect(result.uploadStatus).toBe("failed");
    expect(result.errorReason).toMatch(/アップロード応答形式/);

    // 4. フォールバック動作が実行されていることを確認
    expect(result.fallbackDisplayFormat).toBe("html");
    expect(result.fallbackContent).toBeDefined();
    expect(result.fallbackContent).toContain(
      "レポート生成に失敗しました。画面上で推奨内容を確認するか、後ほど再度お試しください"
    );

    // 5. 推奨内容はHTML形式で画面表示されていることを確認
    expect(result.recommendationContent).toBeDefined();
    expect(result.recommendationContent.recommendedApproach).toBe(
      "顧客業種：小売業、規模：中堅企業向けの提案"
    );
    expect(result.recommendationContent.confidenceScore).toBe(82);

    // 6. ユーザーには適切なメッセージが返却されていることを確認
    expect(result.userMessage).toMatch(
      /レポート生成に失敗しました。画面上で推奨内容を確認するか、後ほど再度お試しください/
    );

    // 7. エラーの詳細情報がログに記録されていることを確認
    expect(result.errorLog).toBeDefined();
    expect(result.errorLog).toMatch(/アップロード応答形式が不正/);
    expect(result.errorLog).toContain("uploadTimestamp");
    expect(result.errorLog).toContain("bucketName");
    expect(result.errorLog).toContain("fileUrl");

    // 8. DBへの保存対象として誤ったファイル情報が含まれていないことを確認
    expect(result.recordToPersist).toBeDefined();
    expect(result.recordToPersist.reportFileUrl).toBeUndefined();
    expect(result.recordToPersist.reportUploadTimestamp).toBeUndefined();
    expect(result.recordToPersist.reportBucketName).toBeUndefined();
    expect(result.recordToPersist.uploadStatus).toBe("failed");

    // 9. 推奨内容自体はrecordに含まれることを確認
    expect(result.recordToPersist.recommendationId).toBeDefined();
    expect(result.recordToPersist.recommendedApproach).toBe(
      "顧客業種：小売業、規模：中堅企業向けの提案"
    );
    expect(result.recordToPersist.confidenceScore).toBe(82);
  });
});